const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const config = require('./schema-gen.config.json');

// Create schemas directory if it doesn't exist
const schemasDir = path.dirname(config.schemaGenerationConfig[0].outputPath);
if (!fs.existsSync(schemasDir)) {
    fs.mkdirSync(schemasDir, { recursive: true });
}

// Generate each schema using ts-json-schema-generator
config.schemaGenerationConfig.forEach(schema => {
    const command = `npx ts-json-schema-generator --path "${schema.sourcePath}" --type ${schema.sourceType} --out ${schema.outputPath} --no-type-check --expose all`;

    console.log(`Generating schema: ${schema.outputPath}`);
    console.log(`Command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error generating schema: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Schema generation stderr: ${stderr}`);
            return;
        }
        if (stdout) {
            console.log(`Command output: ${stdout}`);
        }
        console.log(`Schema generated successfully: ${schema.outputPath}`);

        // Check if the generated schema includes the sub-types
        try {
            const generatedSchema = JSON.parse(fs.readFileSync(schema.outputPath, 'utf8'));
            if (generatedSchema.definitions) {
                console.log(`Schema contains these definitions: ${Object.keys(generatedSchema.definitions).join(', ')}`);
            } else {
                console.log(`Warning: No definitions found in the generated schema`);
            }
        } catch (e) {
            console.error(`Error analyzing schema: ${e}`);
        }

        // Update VSCode settings if targetPattern is defined
        if (schema.targetPattern) {
            updateVSCodeSettings(schema.targetPattern, schema.outputPath);
        }
    });
});

// Update VSCode settings to associate schemas with file patterns
function updateVSCodeSettings(filePattern, schemaPath) {
    const vscodeDir = './.vscode';
    const settingsPath = `${vscodeDir}/settings.json`;

    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(vscodeDir)) {
        fs.mkdirSync(vscodeDir);
    }

    // Read existing settings or create new ones
    let settings = {};
    if (fs.existsSync(settingsPath)) {
        settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }

    // Initialize json.schemas array if it doesn't exist
    if (!settings['json.schemas']) {
        settings['json.schemas'] = [];
    }

    // Check if this schema association already exists
    const schemaIndex = settings['json.schemas'].findIndex(
        s => s.fileMatch && s.fileMatch.includes(filePattern)
    );

    // Convert absolute path to relative path for VSCode settings
    const relativeSchemaPath = path.relative('.', schemaPath).replace(/\\/g, '/');

    if (schemaIndex >= 0) {
        // Update existing association
        settings['json.schemas'][schemaIndex].url = relativeSchemaPath;
    } else {
        // Add new association
        settings['json.schemas'].push({
            fileMatch: [filePattern],
            url: relativeSchemaPath
        });
    }

    // Save updated settings
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log(`VSCode settings updated for pattern: ${filePattern}`);
}

// Function to add schema references to the JSON files
function addSchemaRefToJsonFiles() {
    config.schemaGenerationConfig.forEach(schema => {
        if (!schema.targetPattern) return;

        // Find matching JSON files using glob
        const { globSync } = require('glob');
        const files = globSync(schema.targetPattern);

        if (files.length === 0) {
            console.log(`No files found matching pattern: ${schema.targetPattern}`);
            return;
        }

        console.log(`Found ${files.length} files matching pattern: ${schema.targetPattern}`);

        // Process each file
        files.forEach(filePath => {
            try {
                // Skip if file doesn't exist or is a directory
                if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                    return;
                }

                console.log(`Processing file: ${filePath}`);

                // Read file
                let fileContent = fs.readFileSync(filePath, 'utf8');

                // Skip empty files
                if (!fileContent.trim()) {
                    console.log(`Skipping empty file: ${filePath}`);
                    return;
                }

                let json;
                try {
                    json = JSON.parse(fileContent);
                } catch (parseError) {
                    console.error(`Error parsing JSON in ${filePath}: ${parseError.message}`);
                    return;
                }

                // Calculate relative path from this JSON file to the schema
                const fileDir = path.dirname(filePath);
                const relativeSchemaPath = path.relative(fileDir, schema.outputPath).replace(/\\/g, '/');

                // Update the $schema property
                json.$schema = relativeSchemaPath;

                // Write updated file
                fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
                console.log(`Updated schema reference in: ${filePath}`);
            } catch (error) {
                console.error(`Error processing ${filePath}: ${error.message}`);
            }
        });
    });
}

// Execute the function to add schema references if any file patterns are defined
if (config.schemaGenerationConfig.some(schema => schema.targetPattern)) {
    // Check if glob is installed
    try {
        require.resolve('glob');
    } catch (e) {
        console.error('The "glob" package is required for adding schema references to JSON files.');
        console.error('Please install it using: npm install --save-dev glob');
        process.exit(1);
    }

    addSchemaRefToJsonFiles();
} 