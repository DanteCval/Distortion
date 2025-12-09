import 'package:flutter/material.dart';
import '../models/instrument.dart';
import '../config.dart';

class InstrumentDetailScreen extends StatelessWidget {
  final Instrument instrument;

  const InstrumentDetailScreen({super.key, required this.instrument});

  String get imageUrl {
    final img = instrument.imagen;

    if (img.isEmpty) return '';

    // Si ya viene como URL absoluta, la usamos tal cual
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }

    // Si es solo el nombre de archivo, armamos la URL con la base
    return '${AppConfig.imageBaseUrl}$img';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(instrument.nombre)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🔹 Imagen principal
            Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  color: const Color(0xFF111111),
                  height: 240,
                  width: double.infinity,
                  child: imageUrl.isEmpty
                      ? const Center(
                          child: Icon(
                            Icons.image_not_supported,
                            size: 48,
                            color: Colors.grey,
                          ),
                        )
                      : Image.network(
                          imageUrl,
                          fit: BoxFit
                              .contain, // aquí también sin recorte agresivo
                          errorBuilder: (_, __, ___) => const Center(
                            child: Icon(
                              Icons.broken_image,
                              size: 48,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 🔹 Nombre y marca
            Text(
              instrument.nombre,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              instrument.marca,
              style: const TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 12),

            // 🔹 Tipo, cuerdas y precio
            Row(
              children: [
                Chip(
                  label: Text(
                    instrument.tipo,
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
                const SizedBox(width: 8),
                Chip(
                  label: Text(
                    '${instrument.cuerdas} cuerdas',
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              '\$${instrument.precio.toStringAsFixed(0)} USD',
              style: const TextStyle(
                fontSize: 20,
                color: Color(0xFFe74c3c),
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),

            const Text(
              'Descripción',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Text(instrument.descripcion, style: const TextStyle(fontSize: 14)),
          ],
        ),
      ),
    );
  }
}
