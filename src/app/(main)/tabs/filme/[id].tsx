import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, Button, TextInput } from "react-native";
import { useEffect, useState } from "react";

interface Filme {
  id: number
  nome: string
  estreia: number
  diretor: string
  imagem: string
  descricao: string
  nota: number
}

export default function FilmeDetalhes() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [filmes, setFilmes] = useState<Filme | null>(null)
  const [modalVisivel, setModalVisivel] = useState(false)
  const [avaliarVisivel, setAvaliarVisivel] = useState(false)

  async function adicionarWatchlist() {
    try {
      if (!filmes) return
      const data = await AsyncStorage.getItem("watchlist")
      const lista = data ? JSON.parse(data) : []
      const existente = lista.some((item: Filme) => item.id === filmes.id)
      if (!existente) {
        lista.push(filmes)
        await AsyncStorage.setItem("watchlist", JSON.stringify(lista))
      }
      alert("adicionado à watchlist")
      setModalVisivel(false)
    } catch (error) {
      console.error("Erro ao salvar na watchlist", error)
    }
  }

  async function salvarNota(valor: number) {
    try {
      if (!filmes) return

      const data = await AsyncStorage.getItem("assistido")
      const lista = data ? JSON.parse(data) : []
      const existente = lista.findIndex((item: Filme) => item.id === filmes.id)

      if (existente === -1) {
        const novo = { ...filmes, nota: valor }
        lista.push(novo)
        await AsyncStorage.setItem("assistido", JSON.stringify(lista))
        alert(`Filme marcado como assistido com nota ${valor}`)
      } else {
        lista[existente] = { ...lista[existente], nota: valor }
        await AsyncStorage.setItem("assistido", JSON.stringify(lista))
        alert(`Nota atualizada para ${valor}`)
      }
      setAvaliarVisivel(false)
    } catch (error) {
      console.error(error)
    }
    setAvaliarVisivel(false)
  }  

  useEffect(() => {
  async function carregarFilme() {
    try {
      const baseURL = "http://localhost:3000";
      const filmeId = Array.isArray(id) ? id[0] : id;

      let response = await fetch(`${baseURL}/filmesAlta/${filmeId}`);

      if (!response.ok) {
        response = await fetch(`${baseURL}/filmesRecomendados/${filmeId}`);
      }

      if (!response.ok) {
        response = await fetch(`${baseURL}/outros/${filmeId}`)
      }

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setFilmes(data);
    } catch (error) {
    }
  }

  carregarFilme();
}, [id]);

  if (!filmes) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    )
  }
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 10 }}>
        <Text style={{ marginTop: "auto", color: "#e9de14", fontSize: 18, }}> ⭠ Voltar</Text>
      </TouchableOpacity>

      <View style={styles.borda}>
      <Image source={{ uri: filmes.imagem }} style={styles.imagem} />
      </View>
      <Text style={styles.nome}>{filmes.nome}</Text>
      <Text style={{color: "#fff"}}>{filmes.estreia} - Dirigido por {filmes.diretor}</Text>
      <Text style={{ marginTop: 16, marginBottom: 16, color: "#fff" }}>{filmes.descricao}</Text>
      <Text style={styles.nota}>★ {filmes.nota.toFixed(1)}</Text>

      <Button title="Registrar" onPress={() => setModalVisivel(true)} />
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

                <Text style={styles.modalTitle}>Registro</Text>
                <Button title="Adicionar à watchlist" onPress={adicionarWatchlist} />
                <View style={{ height: 12 }} />
            
                <Button title="marcar como assistido" onPress={() => {
                  setModalVisivel(false)
                  setTimeout(() => { setAvaliarVisivel(true)}, 150)
                }} />
                <View style={{ height: 12}} />
            
                <Button title="Cancelar" onPress={() => setModalVisivel(false)} />
              </View>
          </View>
        </Modal>

          <Modal visible={avaliarVisivel} transparent animationType="slide">
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha sua nota</Text>
            
            <View style={styles.starsContainer}>
              {[ 1, 2, 3, 4, 5].map((n) => (
                    <TouchableOpacity key={n} onPress={() => salvarNota(n)}>
                      <Text style={styles.star}>★</Text>
                    </TouchableOpacity>
              ))}
              </View>

            <Button title="cancelar" onPress={() => setAvaliarVisivel(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#303030",
      padding: 16,
    },
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#303030",
    },
    loadingText: {
      color: "#e9de14",
      fontSize: 18,
    },
    borda: {
      backgroundColor: '#e9de14ff',
      margin: 'auto',
      marginLeft: '0%',
      padding: 1,
      borderRadius: 16
    },
    imagem: {
      width: 200,
      height: 300,
      borderRadius: 10,
      padding: 4,
    },
    nome: {
      color: "#fff",
      fontSize: 26,
      fontWeight: "bold",
      marginTop: 10,
    },
    nota: {
      color: "#e9de14",
      fontSize: 20,
      marginTop: 8,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#494949ff",
      borderRadius: 10,
      padding: 16,
      width: "80%",
      alignItems: "center",
      justifyContent: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#e9de14"
    },
    avaliar: {
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 8,
      marginVertical: 8,
    },
    starsContainer: {
    flexDirection: "row",
    
    justifyContent: "center",
    
    marginBottom:20,
  },
  star: {
    fontSize: 40,
    marginHorizontal: 5,
    color: "#e9de14",
  },
  starSelected: {
    color: "#e9de14",
  },
})