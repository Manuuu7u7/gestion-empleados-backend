import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { empleadosApi } from '../api/empleadosApi';

export default function HomeScreen({ navigation }) {
  const [empleados, setEmpleados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarEmpleados();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const data = await empleadosApi.getAll();
      setEmpleados(data);
      setFiltrados(data);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudieron cargar los empleados.');
    } finally {
      setCargando(false);
    }
  };

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarEmpleados();
    setRefrescando(false);
  };

  const buscar = (texto) => {
    setBusqueda(texto);
    if (texto.trim() === '') {
      setFiltrados(empleados);
    } else {
      const resultado = empleados.filter(
        (emp) =>
          emp.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
          emp.email?.toLowerCase().includes(texto.toLowerCase())
      );
      setFiltrados(resultado);
    }
  };

  const eliminarEmpleado = (id, nombre) => {
    Alert.alert(
      'Eliminar Empleado',
      `¿Estás seguro de eliminar a ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await empleadosApi.delete(id);
              Alert.alert('Éxito', 'Empleado eliminado');
              cargarEmpleados();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  const renderEmpleado = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.nombre ? item.nombre.charAt(0).toUpperCase() : 'E'}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.departamento}>
            {item.departamento || 'Sin departamento'}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.estadoBadge,
          item.estado === 'ACTIVO' ? styles.activo : styles.inactivo,
        ]}
      >
        <Text style={styles.estadoText}>
          {item.estado === 'ACTIVO' ? '🟢 Activo' : '🔴 Inactivo'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.botonEliminar}
        onPress={() => eliminarEmpleado(item.id, item.nombre)}
      >
        <Text style={styles.botonTexto}>🗑️ Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4361ee" />
        <Text style={styles.cargandoTexto}>Cargando empleados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.buscador}
        placeholder="🔍 Buscar empleado..."
        value={busqueda}
        onChangeText={buscar}
      />

      <TouchableOpacity
        style={styles.botonNuevo}
        onPress={() => navigation.navigate('Registrar')}
      >
        <Text style={styles.botonNuevoTexto}>+ Nuevo Empleado</Text>
      </TouchableOpacity>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEmpleado}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioTexto}>No hay empleados registrados</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 16 },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  cargandoTexto: { marginTop: 12, color: '#666', fontSize: 16 },
  buscador: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  botonNuevo: {
    backgroundColor: '#4361ee',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  botonNuevoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4361ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  nombre: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  email: { fontSize: 13, color: '#666', marginTop: 2 },
  departamento: { fontSize: 12, color: '#888', marginTop: 4 },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  activo: { backgroundColor: '#d3f9d8' },
  inactivo: { backgroundColor: '#ffe3e3' },
  estadoText: { fontSize: 12, fontWeight: '600' },
  botonEliminar: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  botonTexto: { color: '#fff', fontSize: 13, fontWeight: '600' },
  vacio: { padding: 60, alignItems: 'center' },
  vacioTexto: { color: '#999', fontSize: 16 },
});