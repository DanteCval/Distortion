// lib/main.dart

import 'package:flutter/material.dart';
import 'config.dart';

import 'models/instrument.dart';
import 'services/api_service.dart';
import 'services/auth_service.dart';
import 'services/favorites_service.dart';
// Importamos solo LoginScreen, para evitar conflicto de nombres
import 'screens/login_screen.dart' show LoginScreen;
import 'screens/instrument_detail_screen.dart';
import 'screens/privacy_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AuthService().loadSession();
  await FavoritesService().loadFavorites();
  final hasSession = await AuthService().hasValidSession();

  runApp(DistortionApp(isLoggedIn: hasSession));
}

class DistortionApp extends StatelessWidget {
  final bool isLoggedIn;

  const DistortionApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Distortion',
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFFe74c3c),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFe74c3c),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF050505),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF050505),
          elevation: 0,
        ),
      ),
      home: isLoggedIn ? const CatalogTabsScreen() : LoginScreen(),
    );
  }
}

class CatalogTabsScreen extends StatefulWidget {
  const CatalogTabsScreen({super.key});

  @override
  State<CatalogTabsScreen> createState() => _CatalogTabsScreenState();
}

class _CatalogTabsScreenState extends State<CatalogTabsScreen>
    with SingleTickerProviderStateMixin {
  late Future<List<Instrument>> _futureInstruments;
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _futureInstruments = _apiService.fetchInstruments();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3, // 👈 ahora son 3 pestañas
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Distortion',
            style: TextStyle(letterSpacing: 2, fontWeight: FontWeight.bold),
          ),
          centerTitle: false,
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Guitarras'),
              Tab(text: 'Bajos'),
              Tab(text: 'Favoritos'), // 👈 nueva pestaña
            ],
          ),
          actions: [
            PopupMenuButton<String>(
              onSelected: (value) async {
                if (value == 'privacy') {
                  if (context.mounted) {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const PrivacyScreen()),
                    );
                  }
                } else if (value == 'logout') {
                  await AuthService().logout();
                  if (context.mounted) {
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (_) => LoginScreen()),
                      (route) => false,
                    );
                  }
                }
              },
              itemBuilder: (context) => const [
                PopupMenuItem(
                  value: 'privacy',
                  child: Text('Aviso de privacidad'),
                ),
                PopupMenuItem(value: 'logout', child: Text('Cerrar sesión')),
              ],
            ),
          ],
        ),
        body: FutureBuilder<List<Instrument>>(
          future: _futureInstruments,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            if (snapshot.hasError) {
              return Center(
                child: Text(
                  'Error: ${snapshot.error}',
                  textAlign: TextAlign.center,
                ),
              );
            }

            final instruments = snapshot.data ?? [];

            final guitars = instruments
                .where((i) => i.tipo.toLowerCase() == 'guitarra')
                .toList();
            final basses = instruments
                .where((i) => i.tipo.toLowerCase() == 'bajo')
                .toList();

            // Rebuild TabBarView cuando cambien los favoritos
            return AnimatedBuilder(
              animation: FavoritesService(),
              builder: (context, _) {
                final favoritesIds = FavoritesService().favorites;
                final favorites = instruments
                    .where((i) => favoritesIds.contains(i.id))
                    .toList();

                return TabBarView(
                  children: [
                    InstrumentsGrid(
                      instruments: guitars,
                      emptyMessage: 'No se encontraron guitarras.',
                    ),
                    InstrumentsGrid(
                      instruments: basses,
                      emptyMessage: 'No se encontraron bajos.',
                    ),
                    InstrumentsGrid(
                      instruments: favorites,
                      emptyMessage: 'Aún no tienes favoritos.',
                    ),
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }
}

class InstrumentsGrid extends StatelessWidget {
  final List<Instrument> instruments;
  final String emptyMessage;

  const InstrumentsGrid({
    super.key,
    required this.instruments,
    required this.emptyMessage,
  });

  @override
  Widget build(BuildContext context) {
    if (instruments.isEmpty) {
      return Center(child: Text(emptyMessage));
    }

    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 0.70,
      ),
      itemCount: instruments.length,
      itemBuilder: (context, index) {
        final instrument = instruments[index];
        return _InstrumentCard(instrument: instrument);
      },
    );
  }
}

class _InstrumentCard extends StatefulWidget {
  final Instrument instrument;

  const _InstrumentCard({super.key, required this.instrument});

  @override
  State<_InstrumentCard> createState() => _InstrumentCardState();
}

class _InstrumentCardState extends State<_InstrumentCard> {
  String get imageUrl {
    final img = widget.instrument.imagen;

    if (img.isEmpty) return '';

    // Si ya viene como URL absoluta (empieza con http), la usamos tal cual
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }

    // Si es solo el nombre de archivo, armamos la URL con la base
    return '${AppConfig.imageBaseUrl}$img';
  }

  @override
  Widget build(BuildContext context) {
    final favoritesService = FavoritesService();
    final isFav = favoritesService.isFavorite(widget.instrument.id);

    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) =>
                InstrumentDetailScreen(instrument: widget.instrument),
          ),
        );
      },
      child: Card(
        color: const Color(0xFF111111),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Stack(
                children: [
                  Positioned.fill(
                    child: ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(16),
                      ),
                      child: imageUrl.isEmpty
                          ? Container(
                              color: const Color(0xFF222222),
                              child: const Icon(Icons.image_not_supported),
                            )
                          : Image.network(
                              imageUrl,
                              fit: BoxFit.contain, // 👈 en vez de cover
                              errorBuilder: (_, __, ___) => Container(
                                color: const Color(0xFF222222),
                                child: const Icon(Icons.broken_image),
                              ),
                            ),
                    ),
                  ),
                  Positioned(
                    top: 4,
                    right: 4,
                    child: IconButton(
                      icon: Icon(
                        isFav ? Icons.favorite : Icons.favorite_border,
                        color: isFav ? Colors.redAccent : Colors.white70,
                      ),
                      onPressed: () async {
                        await favoritesService.toggleFavorite(
                          widget.instrument.id,
                        );
                        if (mounted) {
                          setState(() {});
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 8.0,
                vertical: 6.0,
              ),
              child: Text(
                widget.instrument.nombre,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 8.0,
                vertical: 2.0,
              ),
              child: Text(
                widget.instrument.marca,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 8.0,
                vertical: 4.0,
              ),
              child: Text(
                '\$${widget.instrument.precio.toStringAsFixed(0)} USD',
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFFe74c3c),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
