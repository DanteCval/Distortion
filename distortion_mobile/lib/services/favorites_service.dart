// lib/services/favorites_service.dart

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FavoritesService extends ChangeNotifier {
  FavoritesService._internal();
  static final FavoritesService _instance = FavoritesService._internal();
  factory FavoritesService() => _instance;

  static const String _favoritesKey = 'favorite_instruments';

  Set<String> _favorites = {};
  Set<String> get favorites => _favorites;

  Future<void> loadFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_favoritesKey) ?? [];
    _favorites = list.toSet();
    notifyListeners();
  }

  Future<void> toggleFavorite(String instrumentId) async {
    final prefs = await SharedPreferences.getInstance();
    if (_favorites.contains(instrumentId)) {
      _favorites.remove(instrumentId);
    } else {
      _favorites.add(instrumentId);
    }
    await prefs.setStringList(_favoritesKey, _favorites.toList());
    notifyListeners();
  }

  bool isFavorite(String instrumentId) {
    return _favorites.contains(instrumentId);
  }
}
