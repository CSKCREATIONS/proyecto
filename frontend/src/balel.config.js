module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@': './src',
                        '@/components': './src/components',
                        '@/screens': './src/screens',
                        '@/services': './src/services',
                        '@/types': './src/types',
                        '@/utils': './src/utils',
                        '@/contexts': './src/contexts',
                    },
                },
            ],
        ],
    };
}