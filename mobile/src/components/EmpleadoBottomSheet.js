import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const AVATAR_COLORS = [
    '#4361ee', '#f72585', '#4cc9f0', '#7209b7', '#f77f00',
    '#06d6a0', '#ef476f', '#118ab2', '#ffd166', '#073b4c',
];

const getAvatarColor = (nombre) => {
    if (!nombre) return AVATAR_COLORS[0];
    return AVATAR_COLORS[nombre.charCodeAt(0) % AVATAR_COLORS.length];
};

export default function EmpleadoBottomSheet({
                                                empleado, visible, onClose, onVer, onEditar, onEliminar, theme,
                                            }) {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['55%'], []);

    useEffect(() => {
        if (visible) bottomSheetRef.current?.expand();
        else bottomSheetRef.current?.close();
    }, [visible]);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
        ),
        []
    );

    const cerrar = () => {
        bottomSheetRef.current?.close();
        setTimeout(() => onClose(), 300);
    };

    if (!empleado) return null;

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            onClose={onClose}
            backgroundStyle={{ backgroundColor: theme.card }}
        >
            <BottomSheetView style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.avatar, { backgroundColor: getAvatarColor(empleado.nombre) }]}>
                        <Text style={styles.avatarText}>
                            {empleado.nombre ? empleado.nombre.charAt(0).toUpperCase() : 'E'}
                        </Text>
                    </View>
                    <Text style={[styles.nombre, { color: theme.text }]}>{empleado.nombre}</Text>
                    <Text style={[styles.email, { color: theme.textSecondary }]}>{empleado.email}</Text>
                </View>

                <TouchableOpacity style={styles.opcion} onPress={() => { cerrar(); setTimeout(() => onVer(), 350); }}>
                    <Text style={styles.icono}>👁️</Text>
                    <Text style={[styles.textoOpcion, { color: theme.text }]}>Ver detalle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.opcion} onPress={() => { cerrar(); setTimeout(() => onEditar(), 350); }}>
                    <Text style={styles.icono}>✏️</Text>
                    <Text style={[styles.textoOpcion, { color: theme.text }]}>Editar empleado</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.opcion} onPress={() => { cerrar(); setTimeout(() => onEliminar(), 350); }}>
                    <Text style={styles.icono}>🗑️</Text>
                    <Text style={[styles.textoOpcion, { color: '#ff6b6b' }]}>Eliminar</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    content: { flex: 1, paddingHorizontal: 20 },
    header: { alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
    avatar: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
    nombre: { fontSize: 20, fontWeight: '700' },
    email: { fontSize: 14, marginTop: 4 },
    opcion: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
    icono: { fontSize: 22, marginRight: 16 },
    textoOpcion: { fontSize: 16, fontWeight: '500' },
});