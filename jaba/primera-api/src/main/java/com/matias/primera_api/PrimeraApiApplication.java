package com.matias.primera_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller; // <-- CAMBIÓ AQUÍ
import org.springframework.ui.Model; // <-- NUEVO IMPORT
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@SpringBootApplication
@Controller // <-- Cambiamos de RestController a Controller
public class PrimeraApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrimeraApiApplication.class, args);
	}

	// Agregamos @ResponseBody a los métodos viejos para que sigan funcionando como texto plano
	@GetMapping("/hola") 
	@ResponseBody
	public String decirHola() {
		return "¡Hola Mundo desde mi primera API con Spring Boot!";
	}

	// ESTE ES EL NUEVO MÉTODO CON ESTILO VISUAL
	@GetMapping("/bienvenido")
	public String paginaConEstilo(@RequestParam(value = "nombre", defaultValue = "Matias") String nombre, Model model) {
		// Pasamos la variable al HTML usando el objeto 'model'
		model.addAttribute("mensaje", "¡Hola " + nombre + ", bienvenido a tu hermosa interfaz web!");
		return "inicio"; // Busca el archivo inicio.html en la carpeta templates
	}
}
