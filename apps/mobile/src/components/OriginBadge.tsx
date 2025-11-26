import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "styled-components/native";

export const OriginBadge = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.dsfr_backgroundContrastPinkTuile }]}>
      <Text style={[styles.text, { color: theme.colors.dsfr_textActionHighPinkTuile }]}>Généré par IA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
