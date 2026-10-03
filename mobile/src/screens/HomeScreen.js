import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, RefreshControl, ScrollView, Linking,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Speech from 'expo-speech';
import { SwipeListView } from 'react-native-swipe-list-view';
import { empleadosApi } from '../api/empleadosApi';
import { useTheme } from '../context/ThemeContext';
import EmpleadoBottomSheet from '../components/EmpleadoBottomSheet';
import { registrarParaNotificaciones } from '../services/notificaciones';

const AVATAR_COLORS = [
  '#4361ee', '#f72585', '#4cc9f0', '#7209b7', '#f77f00',
  '#06d6a0', '#ef476f', '#118ab2', '#ffd166', '#073b4c',
];

const getAvatarColor = (nombre) => {
  if (!nombre) return AVATAR_COLORS[0];
  return AVATAR_COLORS[nombre.charCodeAt(0) % AVATAR_COLORS.length];
};

const DEPARTAMENTOS = ['Todos', 'TI', 'Tecnología', 'RRHH', 'Finanzas', 'Marketing', 'Ventas', 'Operaciones'];

export default function HomeScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [empleados, setEmpleados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroDept, setFiltroDept] = useState('Todos');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  useEffect(() => {
    registrarParaNotificaciones();
    const unsubscribe = navigation.addListener('focus', () => cargarEmpleados());
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Estadisticas')} style={{ marginRight: 12 }}>
              <Text style={{ fontSize: 22 }}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
              <Text style={{ fontSize: 22 }}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
      ),
    });
  }, [isDark, navigation]);

  useEffect(() => { cargarEmpleados(); }, []);

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const data = await empleadosApi.getAll();
      setEmpleados(data);
      setFiltrados(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los empleados');
    } finally {
      setCargando(false);
    }
  };

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarEmpleados();
    setRefrescando(false);
  };

  const aplicarFiltros = (texto, dept) => {
    let resultado = empleados;
    if (dept && dept !== 'Todos') {
      resultado = resultado.filter((e) => e.departamento === dept);
    }
    if (texto && texto.trim() !== '') {
      resultado = resultado.filter(
          (e) =>
              e.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
              e.email?.toLowerCase().includes(texto.toLowerCase())
      );
    }
    setFiltrados(resultado);
  };

  const buscar = (texto) => { setBusqueda(texto); aplicarFiltros(texto, filtroDept); };
  const filtrarPorDept = (dept) => { setFiltroDept(dept); aplicarFiltros(busqueda, dept); };

  const iniciarVoz = async () => {
    await Speech.speak('¿Qué empleado buscas?', { language: 'es-ES' });
    Alert.alert('🎤 Búsqueda por voz', 'Escribe el nombre del empleado (reconocimiento de voz en versión final).');
  };

  const eliminarEmpleado = (id, nombre) => {
    Alert.alert('Eliminar Empleado', `¿Estás seguro de eliminar a ${nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await empleadosApi.delete(id);
            cargarEmpleados();
          } catch { Alert.alert('Error', 'No se pudo eliminar'); }
        },
      },
    ]);
  };

  const abrirOpciones = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setBottomSheetVisible(true);
  };

  const renderEmpleado = ({ item, index }) => (
      <Animatable.View animation="fadeInUp" duration={400} delay={index * 50}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <TouchableOpacity onPress={() => abrirOpciones(item)} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.nombre) }]}>
                <Text style={styles.avatarText}>
                  {item.nombre ? item.nombre.charAt(0).toUpperCase() : 'E'}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.nombre, { color: theme.text }]}>{item.nombre}</Text>
                <Text style={[styles.email, { color: theme.textSecondary }]}>{item.email}</Text>
                <Text style={[styles.departamento, { color: theme.textMuted }]}>
                  {item.departamento || 'Sin dept'} · {item.cargo || 'Sin cargo'}
                </Text>
              </View>
              <View style={[styles.estadoBadge, item.estado === 'ACTIVO' ? styles.activo : styles.inactivo]}>
                <Text style={styles.estadoText}>{item.estado === 'ACTIVO' ? '🟢' : '🔴'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Animatable.View>
  );

  const renderHiddenItem = ({ item }) => (
      <View style={styles.rowBack}>
        <TouchableOpacity
            style={styles.backRightBtn}
            onPress={() => eliminarEmpleado(item.id, item.nombre)}
        >
          <Text style={styles.backTextWhite}>🗑️</Text>
          <Text style={styles.backTextWhite}>Eliminar</Text>
        </TouchableOpacity>
      </View>
  );

  if (cargando) {
    return (
        <View style={[styles.centrado, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.cargandoTexto, { color: theme.textSecondary }]}>Cargando...</Text>
        </View>
    );
  }

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Buscador con botón de voz */}
        <View style={[styles.buscadorContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
              style={[styles.buscador, { color: theme.text }]}
              placeholder="🔍 Buscar empleado..."
              placeholderTextColor={theme.textMuted}
              value={busqueda}
              onChangeText={buscar}
          />
          <TouchableOpacity style={styles.botonVoz} onPress={iniciarVoz}>
            <Text style={{ fontSize: 22 }}>🎤</Text>
          </TouchableOpacity>
        </View>

        {/* Chips de filtro */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
          {DEPARTAMENTOS.map((dept) => (
              <TouchableOpacity
                  key={dept}
                  style={[
                    styles.chip,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    filtroDept === dept && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => filtrarPorDept(dept)}
              >
                <Text style={[styles.chipText, { color: theme.text }, filtroDept === dept && { color: '#fff' }]}>
                  {dept}
                </Text>
              </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botón Nuevo */}
        <TouchableOpacity
            style={[styles.botonNuevo, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Registrar')}
        >
          <Text style={styles.botonNuevoTexto}>+ Nuevo Empleado</Text>
        </TouchableOpacity>

        {/* Lista con Swipe */}
        <SwipeListView
            data={filtrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEmpleado}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-100}
            disableRightSwipe
            refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.vacio}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>No hay empleados</Text>
              </View>
            }
        />

        {/* FAB Check-in */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CheckIn')}>
          <Text style={{ fontSize: 28 }}>📸</Text>
        </TouchableOpacity>

        {/* Bottom Sheet */}
        <EmpleadoBottomSheet
            empleado={empleadoSeleccionado}
            visible={bottomSheetVisible}
            theme={theme}
            onClose={() => setBottomSheetVisible(false)}
            onVer={() => navigation.navigate('Detalle', { empleado: empleadoSeleccionado })}
            onEditar={() => navigation.navigate('Registrar', { empleado: empleadoSeleccionado })}
            onEliminar={() => eliminarEmpleado(empleadoSeleccionado?.id, empleadoSeleccionado?.nombre)}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cargandoTexto: { marginTop: 12, fontSize: 16 },
  buscadorContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, marginBottom: 12,
    paddingHorizontal: 14, borderWidth: 1,
  },
  buscador: { flex: 1, paddingVertical: 14, fontSize: 16 },
  botonVoz: { padding: 8 },
  chipsContainer: { marginBottom: 12, maxHeight: 50 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  botonNuevo: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  botonNuevoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card: {
    borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  nombre: { fontSize: 17, fontWeight: '700' },
  email: { fontSize: 13, marginTop: 2 },
  departamento: { fontSize: 12, marginTop: 4 },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activo: { backgroundColor: '#d3f9d8' },
  inactivo: { backgroundColor: '#ffe3e3' },
  estadoText: { fontSize: 12, fontWeight: '600' },
  rowBack: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  backRightBtn: { width: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff6b6b' },
  backTextWhite: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  vacio: { padding: 60, alignItems: 'center' },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#2b8a3e',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
});