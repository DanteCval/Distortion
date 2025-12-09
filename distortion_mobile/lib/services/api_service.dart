// lib/services/api_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/instrument.dart';

class ApiService {
  // TODO: cambia esto por tu URL real
  static const String baseUrl = 'https://distortion-production.up.railway.app';
  // Ejemplo: 'https://distortion-production.up.railway.app';

  static const String instrumentsEndpoint = '/api/instrumentos';

  Future<List<Instrument>> fetchInstruments() async {
    final uri = Uri.parse('$baseUrl$instrumentsEndpoint');

    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((e) => Instrument.fromJson(e)).toList();
    } else {
      throw Exception('Error al obtener instrumentos: ${response.statusCode}');
    }
  }
}
