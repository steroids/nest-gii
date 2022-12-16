export default () => ({
    name: 'steroidsNestGii',
    title: 'Steroids Nest Gii',
    version: '1.0',
    port: parseInt(process.env.PORT, 10),
    cors: {
        allowDomains: [
            '127.0.0.1:9350',
        ],
    },
});