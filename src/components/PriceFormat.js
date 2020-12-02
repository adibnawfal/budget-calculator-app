import React from "react";
import { Text } from "react-native";
import NumberFormat from "react-number-format";

export default function PriceFormat({ value, style }) {
  return (
    <NumberFormat
      value={value}
      displayType={"text"}
      thousandSeparator={true}
      renderText={(value) => <Text style={style}>{value}</Text>}
    />
  );
}
