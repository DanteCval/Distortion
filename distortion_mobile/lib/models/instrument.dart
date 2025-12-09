// lib/models/instrument.dart

class Instrument {
  final String id;
  final String nombre;
  final String tipo; // "guitarra" o "bajo"
  final String marca;
  final int cuerdas;
  final String descripcion;
  final String imagen; // nombre de archivo o URL
  final double precio;

  Instrument({
    required this.id,
    required this.nombre,
    required this.tipo,
    required this.marca,
    required this.cuerdas,
    required this.descripcion,
    required this.imagen,
    required this.precio,
  });

  factory Instrument.fromJson(Map<String, dynamic> json) {
    // Maneja posibles formatos de _id: String o { $oid: ... }
    String id = '';
    if (json['_id'] is String) {
      id = json['_id'];
    } else if (json['_id'] is Map && json['_id']['\$oid'] != null) {
      id = json['_id']['\$oid'];
    } else {
      id = json['id']?.toString() ?? '';
    }

    return Instrument(
      id: id,
      nombre: json['nombre'] ?? '',
      tipo: json['tipo'] ?? '',
      marca: json['marca'] ?? '',
      cuerdas: (json['cuerdas'] ?? 0) is int
          ? json['cuerdas'] as int
          : int.tryParse(json['cuerdas'].toString()) ?? 0,
      descripcion: json['descripcion'] ?? '',
      imagen: json['imagen'] ?? '',
      precio: (json['precio'] ?? 0) is num
          ? (json['precio'] as num).toDouble()
          : double.tryParse(json['precio'].toString()) ?? 0,
    );
  }
}
