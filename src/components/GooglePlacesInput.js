import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';

const GooglePlacesInput = ({ setValue, initialValue = "", placeholder = "Search for location" }) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  const searchPlaces = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o&components=country:in&types=geocode`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (data.status === 'OK') {
        setSuggestions(data.predictions || []);
      } else {
        console.log('Places API error:', data.status);
        setError('Failed to load suggestions');
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Network error');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o&fields=geometry,formatted_address,address_components`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (data.status === 'OK' && data.result) {
        const details = data.result;
        const lat = details.geometry?.location?.lat;
        const lng = details.geometry?.location?.lng;
        const addressComponents = details.address_components || [];
        
        let city = "", state = "", pincode = "";
        
        addressComponents.forEach(c => {
          if (c.types.includes("locality")) city = c.long_name;
          if (c.types.includes("administrative_area_level_1")) state = c.long_name;
          if (c.types.includes("postal_code")) pincode = c.long_name;
          if (!city && c.types.includes("administrative_area_level_2")) city = c.long_name;
        });

        const selectedValue = {
          Locality: details.formatted_address,
          lat,
          lng,
          city,
          state,
          pincode,
        };

        console.log("Selected place:", selectedValue);
        setValue(selectedValue);
        setSearchText(details.formatted_address);
        setSuggestions([]);
        setError(null);
      } else {
        Alert.alert("Error", "Failed to get place details");
      }
    } catch (err) {
      console.error('Error fetching place details:', err);
      Alert.alert("Error", "Failed to get place details");
    }
  };

  const handleTextChange = (text) => {
    setSearchText(text);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  const handleSuggestionPress = (suggestion) => {
    getPlaceDetails(suggestion.place_id);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={{ width: '100%', zIndex: 1000 }}>
      <TextInput
        style={{
          height: 50,
          borderRadius: 8,
          paddingHorizontal: 15,
          borderColor: "#ccc",
          borderWidth: 1,
          fontSize: 16,
          backgroundColor: 'white',
          color: '#333',
        }}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleTextChange}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
      
      {isLoading && (
        <View style={{ 
          position: 'absolute', 
          right: 15, 
          top: 15,
          zIndex: 1001 
        }}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}

      {suggestions.length > 0 && (
        <View style={{
          backgroundColor: 'white',
          borderRadius: 8,
          marginTop: 5,
          elevation: Platform.OS === 'android' ? 5 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          zIndex: 1000,
          position: 'absolute',
          top: 55,
          left: 0,
          right: 0,
          maxHeight: 200,
        }}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                  backgroundColor: 'white',
                }}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text style={{ fontSize: 14, color: '#333' }}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {error && (
        <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{error}</Text>
      )}
    </View>
  );
};

export default GooglePlacesInput;
