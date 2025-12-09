// lib/services/privacy_service.dart

import 'package:shared_preferences/shared_preferences.dart';

class PrivacyService {
  PrivacyService._internal();
  static final PrivacyService _instance = PrivacyService._internal();
  factory PrivacyService() => _instance;

  static const String _privacyKey = 'privacy_accepted';

  Future<bool> isAccepted() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_privacyKey) ?? false;
  }

  Future<void> setAccepted(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_privacyKey, value);
  }

  Future<void> revoke() => setAccepted(false);
}
