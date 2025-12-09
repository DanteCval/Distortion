// lib/services/auth_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService {
  AuthService._internal();
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;

  static const String _tokenKey = 'auth_token';
  static const String _userEmailKey = 'user_email';

  String? _token;
  String? get token => _token;

  Future<void> loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(_tokenKey);
  }

  Future<bool> hasValidSession() async {
    if (_token != null) return true;
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(_tokenKey);
    return _token != null;
  }

  Future<void> _saveSession(String token, String email) async {
    final prefs = await SharedPreferences.getInstance();
    _token = token;
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_userEmailKey, email);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    _token = null;
    await prefs.remove(_tokenKey);
    await prefs.remove(_userEmailKey);
  }

  Future<void> login({required String email, required String password}) async {
    final uri = Uri.parse('${ApiService.baseUrl}/api/auth/login');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final token = data['token'] as String?;
      if (token == null) {
        throw Exception('Respuesta sin token');
      }
      await _saveSession(token, email);
    } else {
      throw Exception('Error de login: ${response.statusCode}');
    }
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse('${ApiService.baseUrl}/api/auth/register');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email, 'password': password}),
    );

    if (response.statusCode != 201 && response.statusCode != 200) {
      throw Exception('Error de registro: ${response.statusCode}');
    }
  }
}
