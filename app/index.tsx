import React, { useState, useEffect, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";

interface User {
  id: number;
  uid: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
}

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const flatListRef = useRef<FlatList<User>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    StatusBar.setBackgroundColor("black");

    const fetchUser = async () => {
      try {
        const response = await axios.get<User[]>(
          "https://random-data-api.com/api/users/random_user?size=80"
        );
        setUsers(response.data);
      } catch (error) {
        setError('Error to fetch data. Please try again later.')
        console.error("Error fetching users:", error);
      }
    };

    fetchUser();
  }, []);

  const handleRowPress = (field: string, value: string) => {
    if (selectedField === field && selectedValue === value) {
      setSelectedField(null);
      setSelectedValue(null);
    } else {
      setSelectedField(field);
      setSelectedValue(value);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <ScrollView contentContainerStyle={styles.userContainer}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <Text style={styles.name}>
        {item.first_name} {item.last_name}
      </Text>

      <View>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleRowPress("ID", item.id.toString())}
        >
          <Text style={styles.label}>ID</Text>
          <AntDesign
            name={
              selectedField === "ID" && selectedValue === item.id.toString()
                ? "down"
                : "right"
            }
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {selectedField === "ID" && selectedValue === item.id.toString() && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedValue}>{item.id}</Text>
          </View>
        )}
      </View>

      <View>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleRowPress("UID", item.uid)}
        >
          <Text style={styles.label}>UID</Text>
          <AntDesign
            name={
              selectedField === "UID" && selectedValue === item.uid
                ? "down"
                : "right"
            }
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {selectedField === "UID" && selectedValue === item.uid && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedValue}>{item.uid}</Text>
          </View>
        )}
      </View>

      <View>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleRowPress("Username", item.username)}
        >
          <Text style={styles.label}>Username</Text>
          <AntDesign
            name={
              selectedField === "Username" && selectedValue === item.username
                ? "down"
                : "right"
            }
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {selectedField === "Username" && selectedValue === item.username && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedValue}>{item.username}</Text>
          </View>
        )}
      </View>

      <View>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleRowPress("Email", item.email)}
        >
          <Text style={styles.label}>Email</Text>
          <AntDesign
            name={
              selectedField === "Email" && selectedValue === item.email
                ? "down"
                : "right"
            }
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {selectedField === "Email" && selectedValue === item.email && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedValue}>{item.email}</Text>
          </View>
        )}
      </View>

      <View>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleRowPress("Password", item.password)}
        >
          <Text style={styles.label}>Password</Text>
          <AntDesign
            name={
              selectedField === "Password" && selectedValue === item.password
                ? "down"
                : "right"
            }
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {selectedField === "Password" && selectedValue === item.password && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedValue}>{item.password}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const handleNext = () => {
    if (currentIndex < users.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    }
  };

  const onScrollEnd = (event: any) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={onScrollEnd}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "transparent" }]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.buttonText, { color: "black" }]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={handleNext}
          disabled={currentIndex === users.length - 1}
        >
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "black" }]}
          onPress={handleNext}
          disabled={currentIndex === users.length - 1}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  userContainer: {
    width: width,
    paddingTop: height * 0.08,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "grey",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 30,
    width: "40%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  icon: {
    borderWidth: 2,
    borderColor: "#000000",
    padding: 15,
    borderRadius: 40,
    width: "16%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 20,
    width: "85%",
    borderRadius: 30,
    height: 50,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  selectedInfo: {
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "grey",
  },
  selectedValue: {
    fontSize: 16,
    color: "#222",
    textAlign: "center",
  },
});
