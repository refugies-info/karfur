import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { StyleSheet, View } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // paddingTop: 10,
    backgroundColor: "#ecf0f1",
    marginBottom: 50,
    paddingTop: Constants.statusBarHeight,
  },
});

export const SearchBarCity = () => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log("data", data);
          console.log("details", details?.address_components);
          if (!details) return;
          const city = details.address_components.filter((data) =>
            data.types.includes("locality")
          )[0].long_name;
          const department = details.address_components.filter((data) =>
            data.types.includes("administrative_area_level_2")
          )[0].long_name;
          console.log("city", city);
          console.log("department", department);
        }}
        query={{
          key: process.env.GOOGLE_API_KEY,
          language: "fr",
          components: "country:fr",
        }}
        minLength={2}
        onFail={(error) => console.error(error)}
        listViewDisplayed="auto"
        filterReverseGeocodingByTypes={[
          "administrative_area_level_3",
          "locality",
        ]}
        fetchDetails={true}
      />
    </View>
  );
};
