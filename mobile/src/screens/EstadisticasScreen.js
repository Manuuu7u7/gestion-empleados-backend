import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { empleadosApi } from '../api/empleadosApi';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

export default function EstadisticasScreen() {
    const { theme } = useTheme();
    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        empleadosApi.getAll()
            .then((data) => setEmpleados(data))
            .catch(console.error)
            .finally(() => setCargando(false));
    }, []);

    const porDept = empleados.reduce((acc, emp) => {
        const dep = emp.departamento || 'Sin dept';
        acc[dep] = (acc[dep] || 0) + 1;
        return acc;
    }, {});

    const colores = ['#4361ee', '#f72585', '#4cc9f0', '#7209b7', '#f77f00', '#06d6a0', '#ef476f'];

    const dataPie = Object.entries(porDept).map(([name, cantidad], i) => ({
        name: name.length > 12 ? name.substring(0, 12) + '...' : name,
        cantidad,
        color: colores[i % colores.length],
        legendFontColor: theme.text,
        legendFontSize: 12,
    }));

    const dataBar = {
        labels: Object.keys(porDept).map((d) => d.substring(0, 8)),
        datasets: [{ data: Object.values(porDept) }],
    };

    if (cargando) {
        return (
            <View style={[styles.centrado, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const activos = empleados.filter((e) => e.estado === 'ACTIVO').length;
    const inactivos = empleados.length - activos;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.titulo, { color: theme.text }]}>📊 Resumen</Text>
                <Text style={[styles.numeroGrande, { color: theme.primary }]}>{empleados.length}</Text>
                <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>Empleados totales</Text>
                <View style={styles.fila}>
                    <View style={[styles.miniCard, { backgroundColor: theme.input }]}>
                        <Text style={[styles.miniNum, { color: '#2b8a3e' }]}>{activos}</Text>
                        <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>🟢 Activos</Text>
                    </View>
                    <View style={[styles.miniCard, { backgroundColor: theme.input }]}>
                        <Text style={[styles.miniNum, { color: '#c92a2a' }]}>{inactivos}</Text>
                        <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>🔴 Inactivos</Text>
                    </View>
                </View>
            </View>

            {dataPie.length > 0 && (
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <Text style={[styles.titulo, { color: theme.text }]}>🏢 Por Departamento</Text>
                    <PieChart
                        data={dataPie}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={{ color: (opacity = 1) => `rgba(0,0,0,${opacity})` }}
                        accessor="cantidad"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                </View>
            )}

            {dataBar.labels.length > 0 && (
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <Text style={[styles.titulo, { color: theme.text }]}>📈 Cantidad por Área</Text>
                    <BarChart
                        data={dataBar}
                        width={screenWidth - 60}
                        height={220}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: theme.card,
                            backgroundGradientFrom: theme.card,
                            backgroundGradientTo: theme.card,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(67,97,238,${opacity})`,
                            labelColor: () => theme.text,
                            barPercentage: 0.7,
                        }}
                        style={{ borderRadius: 16 }}
                    />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { borderRadius: 14, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    titulo: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    numeroGrande: { fontSize: 48, fontWeight: 'bold', textAlign: 'center' },
    subtitulo: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
    fila: { flexDirection: 'row', justifyContent: 'space-around' },
    miniCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 6 },
    miniNum: { fontSize: 28, fontWeight: 'bold' },
    miniLabel: { fontSize: 12, marginTop: 4 },
});