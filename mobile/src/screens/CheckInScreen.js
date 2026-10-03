import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { enviarNotificacion } from '../services/notificaciones';

export default function CheckInScreen({ navigation }) {
    const { theme } = useTheme();
    const [hasPermission, setHasPermission] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState(null);
    const [cargando, setCargando] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const camStatus = await Camera.requestCameraPermissionsAsync();
            setHasPermission(camStatus.status === 'granted');

            const locStatus = await Location.requestForegroundPermissionsAsync();
            if (locStatus.status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation(loc);
            }
        })();
    }, []);

    const tomarFoto = async () => {
        if (!cameraRef.current) return;
        setCargando(true);
        try {
            const foto = await cameraRef.current.takePictureAsync({ quality: 0.5 });
            setPhoto(foto);
        } catch { Alert.alert('Error', 'No se pudo tomar la foto'); }
        finally { setCargando(false); }
    };

    const confirmar = async () => {
        if (!photo) return Alert.alert('Error', 'Toma una foto primero');

        const hora = new Date().toLocaleTimeString();
        const lat = location?.coords?.latitude?.toFixed(4) || 'N/A';
        const lng = location?.coords?.longitude?.toFixed(4) || 'N/A';

        await enviarNotificacion('✅ Check-in exitoso', `Hora: ${hora}`);

        Alert.alert(
            '✅ Check-in Exitoso',
            `Hora: ${hora}\nUbicación: ${lat}, ${lng}`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    if (hasPermission === null) {
        return (
            <View style={[styles.centrado, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Solicitando permisos...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={[styles.centrado, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Sin acceso a la cámara</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.cameraContainer}>
                {!photo ? (
                    <Camera ref={cameraRef} style={styles.camera} type={CameraType.front} />
                ) : (
                    <Image source={{ uri: photo.uri }} style={styles.camera} />
                )}
            </View>

            <View style={styles.controls}>
                {!photo ? (
                    <TouchableOpacity style={styles.captureBtn} onPress={tomarFoto} disabled={cargando}>
                        {cargando ? <ActivityIndicator color="#fff" /> : <View style={styles.captureCircle} />}
                    </TouchableOpacity>
                ) : (
                    <View style={styles.photoControls}>
                        <TouchableOpacity style={[styles.btn, { backgroundColor: '#adb5bd' }]} onPress={() => setPhoto(null)}>
                            <Text style={styles.btnText}>🔄 Reintentar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, { backgroundColor: '#2b8a3e' }]} onPress={confirmar}>
                            <Text style={styles.btnText}>✅ Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {location && (
                <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                    📍 {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cameraContainer: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000', marginBottom: 20 },
    camera: { flex: 1 },
    controls: { alignItems: 'center', paddingVertical: 20 },
    captureBtn: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(67,97,238,0.2)',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 4, borderColor: '#4361ee',
    },
    captureCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4361ee' },
    photoControls: { flexDirection: 'row', gap: 12 },
    btn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    locationText: { textAlign: 'center', fontSize: 12, marginTop: 10 },
});