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
import { useTheme } from '../context/ThemeContext';
import { enviarNotificacion } from '../services/notificaciones';

// Opciones predefinidas
const DEPARTAMENTOS = ['TI', 'Tecnología', 'RRHH', 'Finanzas', 'Marketing', 'Ventas', 'Operaciones'];
const CARGOS = ['Administrador', 'Desarrollador', 'Gerente', 'Vendedor', 'Analista', 'Contador', 'Soporte'];
const ESTADOS = ['ACTIVO', 'INACTIVO'];

export default function RegistrarScreen({ route, navigation }) {
    const empleadoEdit = route.params?.empleado || null;
    const isEditing = !!empleadoEdit;
    const { theme } = useTheme();

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
        // Título dinámico del header
        navigation.setOptions({
            title: isEditing ? 'Editar Empleado' : 'Nuevo Empleado',
        });

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
    }, [empleadoEdit, navigation]);

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
        // ⭐ VALIDACIONES LOCALES
        const erroresLocales = [];

        if (!form.nombre || form.nombre.trim().length < 2) {
            erroresLocales.push('• El nombre debe tener al menos 2 caracteres');
        }
        if (!form.email || !form.email.includes('@')) {
            erroresLocales.push('• El email debe ser válido');
        }
        if (!isEditing && !form.contrasena) {
            erroresLocales.push('• La contraseña es obligatoria');
        }
        if (!isEditing && form.contrasena && form.contrasena.length < 6) {
            erroresLocales.push('• La contraseña debe tener al menos 6 caracteres');
        }
        if (form.telefono && !/^[+]?[0-9]{7,15}$/.test(form.telefono)) {
            erroresLocales.push('• El teléfono debe tener entre 7 y 15 dígitos');
        }
        if (form.email && form.email.length > 100) {
            erroresLocales.push('• El email no puede tener más de 100 caracteres');
        }

        if (erroresLocales.length > 0) {
            Alert.alert(
                '⚠️ Errores en el formulario',
                'Corrige los siguientes campos:\n\n' + erroresLocales.join('\n')
            );
            return;
        }

        setCargando(true);

        try {
            const habilidadesList = form.habilidades
                .split(',')
                .map((h) => h.trim())
                .filter((h) => h.length > 0);

            // ⭐ Armado del objeto a enviar
            const empleadoData = {
                nombre: form.nombre.trim(),
                email: form.email.trim(),
                departamento: form.departamento,
                cargo: form.cargo,
                estado: form.estado,
                telefono: form.telefono,
                fechaContratacion: form.fechaContratacion || null,
                habilidades: habilidadesList,
                direccion: form.direccion,
            };

            // ⭐ Solo enviar contraseña si NO está vacía
            if (form.contrasena && form.contrasena.trim().length > 0) {
                empleadoData.contrasena = form.contrasena;
            }

            console.log('📤 Enviando:', JSON.stringify(empleadoData, null, 2));

            if (isEditing) {
                console.log('✏️ Editando ID:', empleadoEdit.id);
                await empleadosApi.update(empleadoEdit.id, empleadoData);

                await enviarNotificacion(
                    '✅ Empleado Actualizado',
                    `${empleadoData.nombre} fue actualizado correctamente`
                );

                Alert.alert('✅ Éxito', 'Empleado actualizado correctamente');
            } else {
                console.log('➕ Creando nuevo empleado');
                await empleadosApi.create(empleadoData);

                await enviarNotificacion(
                    '✅ Nuevo Empleado',
                    `${empleadoData.nombre} fue registrado exitosamente`
                );

                Alert.alert('✅ Éxito', 'Empleado registrado correctamente');
            }
            navigation.goBack();
        } catch (error) {
            console.error('❌ Error completo:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error message:', error.message);

            // ⭐ MANEJO DETALLADO DE ERRORES
            let mensajeError = '';
            let tituloError = '⚠️ Error al guardar';

            if (error.response) {
                const data = error.response.data;
                const status = error.response.status;

                if (status === 400) {
                    tituloError = '⚠️ Error de validación';
                    if (data.errores) {
                        mensajeError = 'Los siguientes campos son inválidos:\n\n';
                        Object.entries(data.errores).forEach(([campo, mensaje]) => {
                            mensajeError += `• ${campo}: ${mensaje}\n`;
                        });
                    } else if (data.mensaje) {
                        mensajeError = `❌ ${data.mensaje}`;
                    } else {
                        mensajeError = 'Datos inválidos. Revisa el formulario.';
                    }
                } else if (status === 404) {
                    tituloError = '⚠️ No encontrado';
                    mensajeError = `❌ ${data.mensaje || 'El empleado no fue encontrado'}`;
                } else if (status === 500) {
                    tituloError = '⚠️ Error del servidor';
                    mensajeError = `❌ Error interno del servidor\n\n`;
                    mensajeError += `Detalle: ${data.mensaje || 'Error desconocido'}`;
                } else {
                    tituloError = `⚠️ Error ${status}`;
                    mensajeError = data.mensaje || JSON.stringify(data);
                }
            } else if (error.request) {
                tituloError = '⚠️ Error de conexión';
                mensajeError =
                    '❌ No se pudo conectar con el servidor.\n\n' +
                    'Verifica tu conexión a internet.';
            } else {
                tituloError = '⚠️ Error inesperado';
                mensajeError = `❌ ${error.message}`;
            }

            Alert.alert(tituloError, mensajeError);
        } finally {
            setCargando(false);
        }
    };

    const s = styles(theme);

    return (
        <ScrollView style={s.container} contentContainerStyle={s.content}>
            <View style={s.card}>
                {/* Nombre */}
                <Text style={s.label}>Nombre completo *</Text>
                <TextInput
                    style={s.input}
                    placeholder="Juan Pérez"
                    placeholderTextColor={theme.textMuted}
                    value={form.nombre}
                    onChangeText={(text) => handleChange('nombre', text)}
                />

                {/* Email */}
                <Text style={s.label}>Email *</Text>
                <TextInput
                    style={s.input}
                    placeholder="juan@empresa.com"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(text) => handleChange('email', text)}
                />

                {/* Contraseña */}
                <Text style={s.label}>
                    {isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
                </Text>
                <TextInput
                    style={s.input}
                    placeholder={isEditing ? 'Dejar vacío para mantener' : 'Mínimo 6 caracteres'}
                    placeholderTextColor={theme.textMuted}
                    secureTextEntry
                    value={form.contrasena}
                    onChangeText={(text) => handleChange('contrasena', text)}
                />

                {/* Departamento */}
                <Text style={s.label}>Departamento</Text>
                <TouchableOpacity style={s.selector} onPress={() => abrirSelector('departamento')}>
                    <Text style={form.departamento ? s.selectorTexto : s.selectorPlaceholder}>
                        {form.departamento || 'Seleccionar departamento...'}
                    </Text>
                    <Text style={s.selectorFlecha}>▼</Text>
                </TouchableOpacity>

                {/* Cargo */}
                <Text style={s.label}>Cargo</Text>
                <TouchableOpacity style={s.selector} onPress={() => abrirSelector('cargo')}>
                    <Text style={form.cargo ? s.selectorTexto : s.selectorPlaceholder}>
                        {form.cargo || 'Seleccionar cargo...'}
                    </Text>
                    <Text style={s.selectorFlecha}>▼</Text>
                </TouchableOpacity>

                {/* Estado */}
                <Text style={s.label}>Estado</Text>
                <TouchableOpacity style={s.selector} onPress={() => abrirSelector('estado')}>
                    <Text style={s.selectorTexto}>
                        {form.estado === 'ACTIVO' ? '🟢 Activo' : '🔴 Inactivo'}
                    </Text>
                    <Text style={s.selectorFlecha}>▼</Text>
                </TouchableOpacity>

                {/* Teléfono */}
                <Text style={s.label}>Teléfono</Text>
                <TextInput
                    style={s.input}
                    placeholder="+1234567890"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="phone-pad"
                    value={form.telefono}
                    onChangeText={(text) => handleChange('telefono', text)}
                />

                {/* Fecha contratación */}
                <Text style={s.label}>Fecha de contratación</Text>
                <TextInput
                    style={s.input}
                    placeholder="2024-01-15"
                    placeholderTextColor={theme.textMuted}
                    value={form.fechaContratacion}
                    onChangeText={(text) => handleChange('fechaContratacion', text)}
                />

                {/* Habilidades */}
                <Text style={s.label}>Habilidades (separadas por comas)</Text>
                <TextInput
                    style={[s.input, s.textarea]}
                    placeholder="JavaScript, React, Java"
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={2}
                    value={form.habilidades}
                    onChangeText={(text) => handleChange('habilidades', text)}
                />

                {/* Dirección */}
                <Text style={s.label}>Dirección</Text>
                <TextInput
                    style={[s.input, s.textarea]}
                    placeholder="Calle, ciudad, país"
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={2}
                    value={form.direccion}
                    onChangeText={(text) => handleChange('direccion', text)}
                />
            </View>

            {/* Botones */}
            <TouchableOpacity
                style={[s.btnGuardar, cargando && s.btnDisabled]}
                onPress={handleSubmit}
                disabled={cargando}
            >
                {cargando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={s.btnGuardarText}>
                        {isEditing ? '💾 Actualizar Empleado' : '💾 Guardar Empleado'}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={s.btnCancelar} onPress={() => navigation.goBack()}>
                <Text style={s.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            {/* Modal de selección */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={s.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={s.modalContent}>
                        <Text style={s.modalTitulo}>
                            {campoActual === 'departamento' && 'Seleccionar Departamento'}
                            {campoActual === 'cargo' && 'Seleccionar Cargo'}
                            {campoActual === 'estado' && 'Seleccionar Estado'}
                        </Text>
                        <ScrollView>
                            {opcionesActuales.map((opcion) => (
                                <TouchableOpacity
                                    key={opcion}
                                    style={[
                                        s.opcionItem,
                                        form[campoActual] === opcion && s.opcionItemActiva,
                                    ]}
                                    onPress={() => seleccionarOpcion(opcion)}
                                >
                                    <Text
                                        style={[
                                            s.opcionTexto,
                                            form[campoActual] === opcion && s.opcionTextoActiva,
                                        ]}
                                    >
                                        {opcion === 'ACTIVO'
                                            ? '🟢 Activo'
                                            : opcion === 'INACTIVO'
                                                ? '🔴 Inactivo'
                                                : opcion}
                                    </Text>
                                    {form[campoActual] === opcion && (
                                        <Text style={s.checkmark}>✓</Text>
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

// ⭐ ESTILOS DINÁMICOS CON TEMA
const styles = (theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: 16, paddingBottom: 40 },
        card: {
            backgroundColor: theme.card,
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
            color: theme.text,
            marginBottom: 6,
            marginTop: 12,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 15,
            backgroundColor: theme.input,
            color: theme.text,
        },
        textarea: { minHeight: 60, textAlignVertical: 'top' },
        selector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: theme.input,
        },
        selectorTexto: { fontSize: 15, color: theme.text },
        selectorPlaceholder: { fontSize: 15, color: theme.textMuted },
        selectorFlecha: { fontSize: 12, color: theme.textSecondary },
        btnGuardar: {
            backgroundColor: theme.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 20,
        },
        btnDisabled: { opacity: 0.6 },
        btnGuardarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
        btnCancelar: { paddingVertical: 16, alignItems: 'center', marginTop: 8 },
        btnCancelarText: { color: theme.textSecondary, fontSize: 15 },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: theme.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: '70%',
        },
        modalTitulo: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 16,
            textAlign: 'center',
        },
        opcionItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        opcionItemActiva: {
            backgroundColor: theme.mode === 'dark' ? '#1e3a5f' : '#e7f5ff',
        },
        opcionTexto: { fontSize: 16, color: theme.text },
        opcionTextoActiva: { color: theme.primary, fontWeight: '700' },
        checkmark: { fontSize: 18, color: theme.primary, fontWeight: 'bold' },
    });