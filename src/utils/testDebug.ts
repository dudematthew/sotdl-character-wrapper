export const debugResult = (data: any) => {
    if (process.env.DEBUG === 'true') {
        console.log('\n=== Debug result ===');
        console.log(JSON.stringify(data, null, 2));
    }
}; 