//Componente principal de la aplicacion
//Esta es la pagina principal de toda la aplicacion
import 'react-native-gesture-handler'
import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import { AuthProvider } from './frontend/src/contexts/authContext';
import AppNavegator from './frontend/src/navegation/AppNavegator'

export default function App(){
    return(
        <SafeAreaProvider>
            <AuthProvider>
                <AppNavegator />
                <StatusBar style='auto'/>
            </AuthProvider>
        </SafeAreaProvider>
    )
}