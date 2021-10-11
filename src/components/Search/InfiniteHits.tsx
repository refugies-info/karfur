import React from "react";
import { View, FlatList } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import Highlight from "./Highlight";

interface Props {
  hits: any[]
  hasMore: boolean
  refineNext: any
}

const InfiniteHits = ({ hits, hasMore, refineNext }: Props) => (
  <FlatList
    data={hits}
    keyExtractor={item => item.objectID}
    onEndReached={() => hasMore && refineNext()}
    renderItem={({ item }) => (
      <View style={{padding: 10}}>
        <Highlight attribute="titre" hit={item} />
      </View>
    )}
  />
);

export default connectInfiniteHits(InfiniteHits);