import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import RegistrarScreen from './src/screens/RegistrarScreen';
import DetalleScreen from './src/screens/DetalleScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <>
            <StatusBar style="light" />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: { backgroundColor: '#4361ee' },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold' },
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: 'Gestión de Empleados' }}
                    />
                    <Stack.Screen
                        name="Registrar"
                        component={RegistrarScreen}
                        options={{ title: 'Nuevo Empleado' }}
                    />
                    <Stack.Screen
                        name="Detalle"
                        component={DetalleScreen}
                        options={{ title: 'Detalle del Empleado' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}