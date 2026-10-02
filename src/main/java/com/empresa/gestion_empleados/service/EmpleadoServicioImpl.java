package com.empresa.gestion_empleados.service;

import com.empresa.gestion_empleados.dto.EmpleadoDTO;
import com.empresa.gestion_empleados.model.Empleado;
import com.empresa.gestion_empleados.repository.EmpleadoRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmpleadoServicioImpl implements EmpleadoService {

    private final EmpleadoRepositorio empleadoRepositorio;

    @Override
    public List<Empleado> obtenerTodosLosEmpleados() {
        return empleadoRepositorio.findAll();
    }

    @Override
    public Optional<Empleado> obtenerEmpleadoPorId(Long id) {
        return empleadoRepositorio.findById(id);
    }

    @Override
    public Empleado crearEmpleado(EmpleadoDTO dto) {
        Empleado empleado = new Empleado();
        empleado.setNombre(dto.getNombre());
        empleado.setEmail(dto.getEmail());
        empleado.setContrasena(dto.getContrasena());
        empleado.setDepartamento(dto.getDepartamento());
        empleado.setCargo(dto.getCargo());
        empleado.setEstado(dto.getEstado() != null ? dto.getEstado() : "ACTIVO");
        empleado.setTelefono(dto.getTelefono());
        empleado.setDireccion(dto.getDireccion());
        empleado.setFechaContratacion(dto.getFechaContratacion());

        if (dto.getHabilidades() != null && !dto.getHabilidades().isEmpty()) {
            empleado.setHabilidades(String.join(",", dto.getHabilidades()));
        }

        empleado.setAvatar(dto.getAvatar());

        return empleadoRepositorio.save(empleado);
    }

    @Override
    public Empleado actualizarEmpleado(Long id, EmpleadoDTO dto) {
        Empleado empleado = empleadoRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        empleado.setNombre(dto.getNombre());
        empleado.setEmail(dto.getEmail());

        if (dto.getContrasena() != null && !dto.getContrasena().isEmpty()) {
            empleado.setContrasena(dto.getContrasena());
        }

        empleado.setDepartamento(dto.getDepartamento());
        empleado.setCargo(dto.getCargo());
        empleado.setEstado(dto.getEstado());
        empleado.setTelefono(dto.getTelefono());
        empleado.setDireccion(dto.getDireccion());
        empleado.setFechaContratacion(dto.getFechaContratacion());

        if (dto.getHabilidades() != null && !dto.getHabilidades().isEmpty()) {
            empleado.setHabilidades(String.join(",", dto.getHabilidades()));
        } else {
            empleado.setHabilidades(null);
        }

        empleado.setAvatar(dto.getAvatar());

        return empleadoRepositorio.save(empleado);
    }

    @Override
    public void eliminarEmpleado(Long id) {
        empleadoRepositorio.deleteById(id);
    }

    @Override
    public List<Empleado> buscarEmpleados(String palabra) {
        return empleadoRepositorio.buscarEmpleados(palabra);
    }

    @Override
    public List<Empleado> obtenerEmpleadosPorDepartamento(String departamento) {
        return empleadoRepositorio.findByDepartamento(departamento);
    }

    @Override
    public boolean existePorEmail(String email) {
        return empleadoRepositorio.findByEmail(email).isPresent();
    }
}