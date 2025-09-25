import React from 'react';
import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';
import { globalStyles, colors } from '../styles';

const LoadingScreen: React.FC = () => {
    return (
        <View style={globalStyles.loadingScreenContainer}>
            {/* Logo y nombre de la app */}
            <View style={globalStyles.loadingContent}>
                <Text style={globalStyles.appLogo}>Logo</Text>
                <Text style={globalStyles.appName}>PANGEA</Text>
                <Text style={globalStyles.appSubtitle}>JLA Global Company</Text>
            </View>

            {/* Indicador de carga */}
            <View style={globalStyles.loadingIndicatorContainer}>
                <ActivityIndicator size='large' color={colors.primary} />
                <Text style={globalStyles.loadingIndicatorText}>Cargando...</Text>
            </View>
        </View>
    );
};

export default LoadingScreen;
