import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';

export default function DetalleScreen({ route, navigation }) {
    const { empleado } = route.params;

    const habilidades = empleado.habilidades && empleado.habilidades.length > 0
        ? empleado.habilidades
        : [];

    const handleLlamar = () => {
        if (empleado.telefono) {
            Linking.openURL(`tel:${empleado.telefono}`);
        } else {
            Alert.alert('Sin teléfono', 'Este empleado no tiene teléfono registrado');
        }
    };

    const handleEmail = () => {
        if (empleado.email) {
            Linking.openURL(`mailto:${empleado.email}`);
        }
    };

    const handleEditar = () => {
        navigation.navigate('Registrar', { empleado });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header con avatar */}
            <View style={styles.header}>
                <View style={styles.avatarGrande}>
                    <Text style={styles.avatarText}>
                        {empleado.nombre ? empleado.nombre.charAt(0).toUpperCase() : 'E'}
                    </Text>
                </View>
                <Text style={styles.nombreGrande}>{empleado.nombre || 'Sin nombre'}</Text>
                <Text style={styles.cargoGrande}>{empleado.cargo || 'Sin cargo'}</Text>
                <View
                    style={[
                        styles.estadoBadge,
                        empleado.estado === 'ACTIVO' ? styles.activo : styles.inactivo,
                    ]}
                >
                    <Text style={styles.estadoText}>
                        {empleado.estado === 'ACTIVO' ? '🟢 Activo' : '🔴 Inactivo'}
                    </Text>
                </View>
            </View>

            {/* Botones de acción rápida */}
            <View style={styles.acciones}>
                <TouchableOpacity style={styles.botonAccion} onPress={handleEmail}>
                    <Text style={styles.botonIcono}>✉️</Text>
                    <Text style={styles.botonTextoAccion}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonAccion} onPress={handleLlamar}>
                    <Text style={styles.botonIcono}>📞</Text>
                    <Text style={styles.botonTextoAccion}>Llamar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonAccion} onPress={handleEditar}>
                    <Text style={styles.botonIcono}>✏️</Text>
                    <Text style={styles.botonTextoAccion}>Editar</Text>
                </TouchableOpacity>
            </View>

            {/* Información */}
            <View style={styles.card}>
                <Text style={styles.cardTitulo}>📋 Información</Text>

                <View style={styles.fila}>
                    <Text style={styles.etiqueta}>Nombre</Text>
                    <Text style={styles.valor}>{empleado.nombre || '-'}</Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.etiqueta}>Email</Text>
                    <Text style={styles.valor}>{empleado.email || '-'}</Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.etiqueta}>Teléfono</Text>
                    <Text style={styles.valor}>{empleado.telefono || '-'}</Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.etiqueta}>Departamento</Text>
                    <Text style={styles.valor}>{empleado.departamento || '-'}</Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.etiqueta}>Cargo</Text>
                    <Text style={styles.valor}>{empleado.cargo || '-'}</Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.etiqueta}>Fecha contratación</Text>
                    <Text style={styles.valor}>{empleado.fechaContratacion || '-'}</Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.etiqueta}>Dirección</Text>
                    <Text style={styles.valor}>{empleado.direccion || '-'}</Text>
                </View>

                <View style={styles.fila}>
                    <Text style={styles.etiqueta}>ID</Text>
                    <Text style={styles.valor}>{empleado.id}</Text>
                </View>
            </View>

            {/* Habilidades */}
            {habilidades.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>💡 Habilidades</Text>
                    <View style={styles.habilidadesContenedor}>
                        {habilidades.map((habilidad, index) => (
                            <View key={index} style={styles.habilidadChip}>
                                <Text style={styles.habilidadTexto}>{habilidad}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarGrande: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4361ee',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#4361ee',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    nombreGrande: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a2e',
    },
    cargoGrande: {
        fontSize: 15,
        color: '#666',
        marginTop: 4,
    },
    estadoBadge: {
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    activo: { backgroundColor: '#d3f9d8' },
    inactivo: { backgroundColor: '#ffe3e3' },
    estadoText: { fontSize: 13, fontWeight: '600' },
    acciones: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    botonAccion: {
        alignItems: 'center',
        padding: 8,
    },
    botonIcono: { fontSize: 24, marginBottom: 4 },
    botonTextoAccion: { fontSize: 12, color: '#4361ee', fontWeight: '600' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 12,
    },
    fila: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f2f5',
    },
    etiqueta: {
        width: 130,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    valor: {
        flex: 1,
        fontSize: 14,
        color: '#1a1a2e',
        fontWeight: '500',
    },
    habilidadesContenedor: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    habilidadChip: {
        backgroundColor: '#e7f5ff',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    habilidadTexto: {
        color: '#1971c2',
        fontSize: 13,
        fontWeight: '600',
    },
});