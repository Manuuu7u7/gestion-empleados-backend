package com.empresa.gestion_empleados.controller;

import com.empresa.gestion_empleados.dto.EmpleadoDTO;
import com.empresa.gestion_empleados.dto.EmpleadoRespuestaDTO;
import com.empresa.gestion_empleados.model.Empleado;
import com.empresa.gestion_empleados.service.EmpleadoService;  // ⭐ service (NO servicio)
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmpleadoController {

    private final EmpleadoService empleadoService;  // ⭐ service (NO servicio)

    // Obtener todos los empleados
    @GetMapping
    public ResponseEntity<List<EmpleadoRespuestaDTO>> obtenerTodosLosEmpleados() {
        List<Empleado> empleados = empleadoService.obtenerTodosLosEmpleados();
        List<EmpleadoRespuestaDTO> respuesta = empleados.stream()
                .map(EmpleadoRespuestaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    // Obtener empleado por ID
    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoRespuestaDTO> obtenerEmpleadoPorId(@PathVariable Long id) {
        return empleadoService.obtenerEmpleadoPorId(id)
                .map(empleado -> ResponseEntity.ok(new EmpleadoRespuestaDTO(empleado)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear nuevo empleado
    @PostMapping
    public ResponseEntity<EmpleadoRespuestaDTO> crearEmpleado(@Valid @RequestBody EmpleadoDTO empleadoDTO) {
        if (empleadoService.existePorEmail(empleadoDTO.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        Empleado creado = empleadoService.crearEmpleado(empleadoDTO);
        EmpleadoRespuestaDTO respuesta = new EmpleadoRespuestaDTO(creado);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    // Actualizar empleado
    @PutMapping("/{id}")
    public ResponseEntity<EmpleadoRespuestaDTO> actualizarEmpleado(
            @PathVariable Long id,
            @Valid @RequestBody EmpleadoDTO empleadoDTO) {
        try {
            Empleado actualizado = empleadoService.actualizarEmpleado(id, empleadoDTO);
            EmpleadoRespuestaDTO respuesta = new EmpleadoRespuestaDTO(actualizado);
            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar empleado
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEmpleado(@PathVariable Long id) {
        empleadoService.eliminarEmpleado(id);
        return ResponseEntity.noContent().build();
    }

    // Buscar empleados
    @GetMapping("/buscar")
    public ResponseEntity<List<EmpleadoRespuestaDTO>> buscarEmpleados(@RequestParam String q) {
        List<Empleado> empleados = empleadoService.buscarEmpleados(q);
        List<EmpleadoRespuestaDTO> respuesta = empleados.stream()
                .map(EmpleadoRespuestaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }

    // Obtener empleados por departamento
    @GetMapping("/departamento/{departamento}")
    public ResponseEntity<List<EmpleadoRespuestaDTO>> obtenerEmpleadosPorDepartamento(@PathVariable String departamento) {
        List<Empleado> empleados = empleadoService.obtenerEmpleadosPorDepartamento(departamento);
        List<EmpleadoRespuestaDTO> respuesta = empleados.stream()
                .map(EmpleadoRespuestaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respuesta);
    }
}