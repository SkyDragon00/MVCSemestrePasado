"use client";

import React, { useState } from "react";
import styles from "../styles/buscador.module.css"; // Ensure this path is correct

const Buscador = () => {
  const [fechaVenta, setFechaVenta] = useState(""); // Date input should be an empty string initially
  const [fechaFin, setFechaFin] = useState("");
  const [resultado, setResultado] = useState(null);

  const handleFechaVentaChange = (event) => {
    setFechaVenta(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const handleBuscarClick = async () => {
    try {
      const response = await fetch("/api/buscar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fechaVenta, fechaFin }),
      });
      const data = await response.json();
      console.log(data);

      setResultado(data);
    } catch (error) {
      console.error("Error al buscar el producto más vendido:", error);
    }
  };

  return (
    <div>
      <h2 className={styles.titulo}>Producto más Vendido</h2>
      <div className={styles.filtros}>
        <label className={styles.label} htmlFor="fechaVenta">
          Fecha de Venta:
        </label>
        <input
          className={styles.fechas}
          type="date"
          id="fechaVenta"
          value={fechaVenta}
          onChange={handleFechaVentaChange}
        />

        <label className={styles.label} htmlFor="fechaFin">
          Fecha Final:
        </label>
        <input
          className={styles.fechas}
          type="date"
          id="fechaFin"
          value={fechaFin}
          onChange={handleFechaFinChange}
        />
      </div>
      <div className={styles.conbutton}>
        <button className={styles.boton} onClick={handleBuscarClick}>
          Buscar
        </button>
      </div>
      {resultado && (
        <div>
          <h3>Resultado:</h3>
          <p>Producto más vendido: {resultado.producto}</p>
          <p>Total de ventas: {resultado.monto}</p>
          <p>Vendedor: {resultado.vendedor.nombre}</p>
        </div>
      )}
    </div>
  );
};

export default Buscador; // Export as default for easier import