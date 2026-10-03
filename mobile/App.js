import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import RegistrarScreen from './src/screens/RegistrarScreen';
import DetalleScreen from './src/screens/DetalleScreen';
import EstadisticasScreen from './src/screens/EstadisticasScreen';
import CheckInScreen from './src/screens/CheckInScreen';

const Stack = createNativeStackNavigator();

function AppContent() {
    const { theme, isDark } = useTheme();

    return (
        <>
            <StatusBar style="light" />
            <NavigationContainer
                theme={{
                    dark: isDark,
                    colors: {
                        primary: theme.primary,
                        background: theme.background,
                        card: theme.header,
                        text: '#fff',
                        border: theme.border,
                        notification: theme.primary,
                    },
                }}
            >
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: { backgroundColor: theme.header },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold' },
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gestión de Empleados' }} />
                    <Stack.Screen name="Registrar" component={RegistrarScreen} options={{ title: 'Nuevo Empleado' }} />
                    <Stack.Screen name="Detalle" component={DetalleScreen} options={{ title: 'Detalle' }} />
                    <Stack.Screen name="Estadisticas" component={EstadisticasScreen} options={{ title: 'Estadísticas' }} />
                    <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Marcar Asistencia' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}