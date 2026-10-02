package com.empresa.gestion_empleados.repository;

import com.empresa.gestion_empleados.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepositorio extends JpaRepository<Empleado, Long> {

    Optional<Empleado> findByEmail(String email);

    List<Empleado> findByDepartamento(String departamento);

    List<Empleado> findByEstado(String estado);

    @Query("SELECT e FROM Empleado e WHERE LOWER(e.nombre) LIKE LOWER(CONCAT('%', :palabra, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :palabra, '%'))")
    List<Empleado> buscarEmpleados(@Param("palabra") String palabra);
}