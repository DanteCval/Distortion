// lib/screens/privacy_screen.dart

import 'package:flutter/material.dart';
import '../services/privacy_service.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

  Future<void> _revokeConsent(BuildContext context) async {
    await PrivacyService().revoke();
    await AuthService().logout();

    if (context.mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Aviso de privacidad')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Expanded(
              child: SingleChildScrollView(
                child: Text(
                  // Aquí pega tu aviso real
                  'Aviso de privacidad\n\n'
                  'Aquí va el texto completo del aviso de privacidad de la aplicación '
                  'Distortion. Se explican el uso de datos personales, finalidad, '
                  'medios de protección y derechos del usuario, de acuerdo con la '
                  'normativa aplicable.\n\n'
                  '... (texto que tú completarás) ...',
                  textAlign: TextAlign.justify,
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                ),
                onPressed: () => _revokeConsent(context),
                child: const Text('Revocar consentimiento y cerrar sesión'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
