import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { empleadosApi } from '../api/empleadosApi';

export default function RegistrarScreen({ navigation }) {
    const [cargando, setCargando] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        contrasena: '',
        departamento: '',
        cargo: '',
        estado: 'ACTIVO',
        telefono: '',
        fechaContratacion: '',
        habilidades: '',
        direccion: '',
    });

    const handleChange = (campo, valor) => {
        setForm({ ...form, [campo]: valor });
    };

    const handleSubmit = async () => {
        if (!form.nombre || !form.email || !form.contrasena) {
            Alert.alert('Error', 'Nombre, email y contraseña son obligatorios');
            return;
        }

        if (form.contrasena.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setCargando(true);

        try {
            const habilidadesList = form.habilidades
                .split(',')
                .map((h) => h.trim())
                .filter((h) => h.length > 0);

            const empleadoData = {
                ...form,
                habilidades: habilidadesList,
                fechaContratacion: form.fechaContratacion || null,
            };

            await empleadosApi.create(empleadoData);
            Alert.alert('Éxito', '✅ Empleado registrado exitosamente', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', '❌ No se pudo registrar el empleado');
        } finally {
            setCargando(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>
                <Text style={styles.label}>Nombre completo *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Juan Pérez"
                    value={form.nombre}
                    onChangeText={(text) => handleChange('nombre', text)}
                />

                <Text style={styles.label}>Email *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="juan@empresa.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(text) => handleChange('email', text)}
                />

                <Text style={styles.label}>Contraseña *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    secureTextEntry
                    value={form.contrasena}
                    onChangeText={(text) => handleChange('contrasena', text)}
                />

                <Text style={styles.label}>Departamento</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tecnología"
                    value={form.departamento}
                    onChangeText={(text) => handleChange('departamento', text)}
                />

                <Text style={styles.label}>Cargo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Desarrollador"
                    value={form.cargo}
                    onChangeText={(text) => handleChange('cargo', text)}
                />

                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+1234567890"
                    keyboardType="phone-pad"
                    value={form.telefono}
                    onChangeText={(text) => handleChange('telefono', text)}
                />

                <Text style={styles.label}>Fecha de contratación</Text>
                <TextInput
                    style={styles.input}
                    placeholder="2024-01-15"
                    value={form.fechaContratacion}
                    onChangeText={(text) => handleChange('fechaContratacion', text)}
                />

                <Text style={styles.label}>Habilidades (separadas por comas)</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="JavaScript, React, Java"
                    multiline
                    numberOfLines={2}
                    value={form.habilidades}
                    onChangeText={(text) => handleChange('habilidades', text)}
                />

                <Text style={styles.label}>Dirección</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Calle, ciudad, país"
                    multiline
                    numberOfLines={2}
                    value={form.direccion}
                    onChangeText={(text) => handleChange('direccion', text)}
                />
            </View>

            <TouchableOpacity
                style={[styles.btnGuardar, cargando && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={cargando}
            >
                {cargando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.btnGuardarText}>💾 Guardar Empleado</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#343a40',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#f8f9fa',
        color: '#333',
    },
    textarea: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    btnGuardar: {
        backgroundColor: '#4361ee',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    btnGuardarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    btnCancelar: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    btnCancelarText: {
        color: '#666',
        fontSize: 15,
    },
});