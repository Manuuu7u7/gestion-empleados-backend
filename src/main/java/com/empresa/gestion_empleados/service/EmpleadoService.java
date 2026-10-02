package com.empresa.gestion_empleados.service;  // ⭐ service (NO servicio)

import com.empresa.gestion_empleados.dto.EmpleadoDTO;
import com.empresa.gestion_empleados.model.Empleado;

import java.util.List;
import java.util.Optional;

public interface EmpleadoService {
    List<Empleado> obtenerTodosLosEmpleados();
    Optional<Empleado> obtenerEmpleadoPorId(Long id);
    Empleado crearEmpleado(EmpleadoDTO empleadoDTO);
    Empleado actualizarEmpleado(Long id, EmpleadoDTO empleadoDTO);
    void eliminarEmpleado(Long id);
    List<Empleado> buscarEmpleados(String palabra);
    List<Empleado> obtenerEmpleadosPorDepartamento(String departamento);
    boolean existePorEmail(String email);
}