import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { empleadosApi } from '../api/empleadosApi';

// Opciones predefinidas
const DEPARTAMENTOS = ['TI', 'Tecnología', 'RRHH', 'Finanzas', 'Marketing', 'Ventas', 'Operaciones'];
const CARGOS = ['Administrador', 'Desarrollador', 'Gerente', 'Vendedor', 'Analista', 'Contador', 'Soporte'];
const ESTADOS = ['ACTIVO', 'INACTIVO'];

export default function RegistrarScreen({ route, navigation }) {
    const empleadoEdit = route.params?.empleado || null;
    const isEditing = !!empleadoEdit;

    const [cargando, setCargando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [campoActual, setCampoActual] = useState(null);
    const [opcionesActuales, setOpcionesActuales] = useState([]);

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

    useEffect(() => {
        if (empleadoEdit) {
            setForm({
                nombre: empleadoEdit.nombre || '',
                email: empleadoEdit.email || '',
                contrasena: '',
                departamento: empleadoEdit.departamento || '',
                cargo: empleadoEdit.cargo || '',
                estado: empleadoEdit.estado || 'ACTIVO',
                telefono: empleadoEdit.telefono || '',
                fechaContratacion: empleadoEdit.fechaContratacion || '',
                habilidades: empleadoEdit.habilidades ? empleadoEdit.habilidades.join(', ') : '',
                direccion: empleadoEdit.direccion || '',
            });
        }
    }, [empleadoEdit]);

    const abrirSelector = (campo) => {
        setCampoActual(campo);
        if (campo === 'departamento') setOpcionesActuales(DEPARTAMENTOS);
        else if (campo === 'cargo') setOpcionesActuales(CARGOS);
        else if (campo === 'estado') setOpcionesActuales(ESTADOS);
        setModalVisible(true);
    };

    const seleccionarOpcion = (opcion) => {
        setForm({ ...form, [campoActual]: opcion });
        setModalVisible(false);
    };

    const handleChange = (campo, valor) => {
        setForm({ ...form, [campo]: valor });
    };

    const handleSubmit = async () => {
        if (!form.nombre || !form.email) {
            Alert.alert('Error', 'Nombre y email son obligatorios');
            return;
        }

        if (!isEditing && !form.contrasena) {
            Alert.alert('Error', 'La contraseña es obligatoria');
            return;
        }

        if (!isEditing && form.contrasena.length < 6) {
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
                nombre: form.nombre,
                email: form.email,
                contrasena: form.contrasena,
                departamento: form.departamento,
                cargo: form.cargo,
                estado: form.estado,
                telefono: form.telefono,
                fechaContratacion: form.fechaContratacion || null,
                habilidades: habilidadesList,
                direccion: form.direccion,
            };

            console.log('📤 Enviando:', JSON.stringify(empleadoData, null, 2));

            if (isEditing) {
                console.log('✏️ Editando ID:', empleadoEdit.id);
                await empleadosApi.update(empleadoEdit.id, empleadoData);
                Alert.alert('Éxito', '✅ Empleado actualizado correctamente');
            } else {
                console.log('➕ Creando nuevo empleado');
                await empleadosApi.create(empleadoData);
                Alert.alert('Éxito', '✅ Empleado registrado correctamente');
            }
            navigation.goBack();
        } catch (error) {
            console.error('❌ Error completo:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error message:', error.message);

            Alert.alert(
                'Error',
                `No se pudo guardar.\n\nDetalle: ${
                    JSON.stringify(error.response?.data) || error.message
                }`
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>
                {/* Nombre */}
                <Text style={styles.label}>Nombre completo *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Juan Pérez"
                    value={form.nombre}
                    onChangeText={(text) => handleChange('nombre', text)}
                />

                {/* Email */}
                <Text style={styles.label}>Email *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="juan@empresa.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(text) => handleChange('email', text)}
                />

                {/* Contraseña */}
                <Text style={styles.label}>
                    {isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder={isEditing ? 'Dejar vacío para mantener' : 'Mínimo 6 caracteres'}
                    secureTextEntry
                    value={form.contrasena}
                    onChangeText={(text) => handleChange('contrasena', text)}
                />

                {/* Departamento - Selector */}
                <Text style={styles.label}>Departamento</Text>
                <TouchableOpacity
                    style={styles.selector}
                    onPress={() => abrirSelector('departamento')}
                >
                    <Text style={form.departamento ? styles.selectorTexto : styles.selectorPlaceholder}>
                        {form.departamento || 'Seleccionar departamento...'}
                    </Text>
                    <Text style={styles.selectorFlecha}>▼</Text>
                </TouchableOpacity>

                {/* Cargo - Selector */}
                <Text style={styles.label}>Cargo</Text>
                <TouchableOpacity
                    style={styles.selector}
                    onPress={() => abrirSelector('cargo')}
                >
                    <Text style={form.cargo ? styles.selectorTexto : styles.selectorPlaceholder}>
                        {form.cargo || 'Seleccionar cargo...'}
                    </Text>
                    <Text style={styles.selectorFlecha}>▼</Text>
                </TouchableOpacity>

                {/* Estado - Selector */}
                <Text style={styles.label}>Estado</Text>
                <TouchableOpacity
                    style={styles.selector}
                    onPress={() => abrirSelector('estado')}
                >
                    <Text style={styles.selectorTexto}>
                        {form.estado === 'ACTIVO' ? '🟢 Activo' : '🔴 Inactivo'}
                    </Text>
                    <Text style={styles.selectorFlecha}>▼</Text>
                </TouchableOpacity>

                {/* Teléfono */}
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+1234567890"
                    keyboardType="phone-pad"
                    value={form.telefono}
                    onChangeText={(text) => handleChange('telefono', text)}
                />

                {/* Fecha contratación */}
                <Text style={styles.label}>Fecha de contratación</Text>
                <TextInput
                    style={styles.input}
                    placeholder="2024-01-15"
                    value={form.fechaContratacion}
                    onChangeText={(text) => handleChange('fechaContratacion', text)}
                />

                {/* Habilidades */}
                <Text style={styles.label}>Habilidades (separadas por comas)</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="JavaScript, React, Java"
                    multiline
                    numberOfLines={2}
                    value={form.habilidades}
                    onChangeText={(text) => handleChange('habilidades', text)}
                />

                {/* Dirección */}
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

            {/* Botones */}
            <TouchableOpacity
                style={[styles.btnGuardar, cargando && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={cargando}
            >
                {cargando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.btnGuardarText}>
                        {isEditing ? '💾 Actualizar Empleado' : '💾 Guardar Empleado'}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            {/* Modal de selección */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitulo}>
                            {campoActual === 'departamento' && 'Seleccionar Departamento'}
                            {campoActual === 'cargo' && 'Seleccionar Cargo'}
                            {campoActual === 'estado' && 'Seleccionar Estado'}
                        </Text>
                        <ScrollView>
                            {opcionesActuales.map((opcion) => (
                                <TouchableOpacity
                                    key={opcion}
                                    style={[
                                        styles.opcionItem,
                                        form[campoActual] === opcion && styles.opcionItemActiva,
                                    ]}
                                    onPress={() => seleccionarOpcion(opcion)}
                                >
                                    <Text
                                        style={[
                                            styles.opcionTexto,
                                            form[campoActual] === opcion && styles.opcionTextoActiva,
                                        ]}
                                    >
                                        {opcion === 'ACTIVO' ? '🟢 Activo' : opcion === 'INACTIVO' ? '🔴 Inactivo' : opcion}
                                    </Text>
                                    {form[campoActual] === opcion && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    content: { padding: 16, paddingBottom: 40 },
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
    textarea: { minHeight: 60, textAlignVertical: 'top' },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
    },
    selectorTexto: { fontSize: 15, color: '#333' },
    selectorPlaceholder: { fontSize: 15, color: '#adb5bd' },
    selectorFlecha: { fontSize: 12, color: '#666' },
    btnGuardar: {
        backgroundColor: '#4361ee',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    btnDisabled: { opacity: 0.6 },
    btnGuardarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    btnCancelar: { paddingVertical: 16, alignItems: 'center', marginTop: 8 },
    btnCancelarText: { color: '#666', fontSize: 15 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%',
    },
    modalTitulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 16,
        textAlign: 'center',
    },
    opcionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f2f5',
    },
    opcionItemActiva: {
        backgroundColor: '#e7f5ff',
    },
    opcionTexto: { fontSize: 16, color: '#333' },
    opcionTextoActiva: { color: '#4361ee', fontWeight: '700' },
    checkmark: { fontSize: 18, color: '#4361ee', fontWeight: 'bold' },
});