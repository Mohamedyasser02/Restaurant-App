import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Items from "./Items";
import DATA from "./DATA/items.json";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import {
  where,
  collection,
  query,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/Config";

export default function Category({ name }) {
  const [data, setData] = useState([]);
  const [DATA, setDATA] = useState([]);
  const [text, setText] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataFromFireBase();
  }, []);

  const getDataFromFireBase = async () => {
    const q = query(collection(db, "Foods"), where("category", "==", name));
    const querySnapshot = await getDocs(q);
    const DataFireBase = querySnapshot.docs.map((doc) => doc.data());
    setList(DataFireBase);
    setLoading(false);
    setData(DataFireBase);
    setDATA(DataFireBase);
  };
  const searchItems = (searchFor) => {
    console.log('searchFor', searchFor);
    setData(DATA.filter((user) => user.name.toLowerCase().includes(searchFor.toLowerCase())));
  };

  return (
    <>
      {loading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#ffb01d" style={styles.ActivityIndicator} />
        </View>
      ) : (
        <View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search for"
           
            onChangeText={(t) => {
              setText(t);
              searchItems(t);
            }}
          />
          <TouchableOpacity onPress={() => searchItems(text)}>
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
        
          data={data}
          renderItem={({ item }) => {
            return (
              <View style={styles.container}>
                <Items item={item} />
              </View>
            );
          }}
        />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ActivityIndicator:{
    flex:1,
    justifyContent:'center',
    alignContent:'center',
    marginTop:'40%',
    size:100,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "white",
    borderRadius: 25,
    margin: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
});
