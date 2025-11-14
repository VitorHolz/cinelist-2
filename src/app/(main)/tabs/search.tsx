import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

interface Filme {
  id: number
  nome: string
  diretor: string
  imagem: string
  nota: number
}

export default function SearchScreen() {
  const [termo, setTermo] = useState("")
  const [todosFilmes, setTodosFilmes] = useState<Filme[]>([])
  const [filmesPesquisa, setFilmesPesquisa] = useState<Filme[]>([])
  const router = useRouter()

  useEffect(() => {
    async function carregarFilmes() {
      try {
        const baseURL = "http://localhost:3000"
        const alta = await fetch(`${baseURL}/filmesAlta`).then((r) => r.json())
        const recomendados = await fetch(`${baseURL}/filmesRecomendados`).then((r) => r.json())
        const outros = await fetch(`${baseURL}/outros`).then((r) => r.json())

        const tudo = [...alta, ...recomendados, ...outros]
        setTodosFilmes(tudo)
        setFilmesPesquisa(tudo)
      } catch (error) {
        console.error(error)
      }
    }

    carregarFilmes()
  }, [])

  function pesquisa(texto: string) {
    setTermo(texto)

    if (texto.trim() === "") {
      setFilmesPesquisa(todosFilmes)
      return
    }

    const resultado = todosFilmes.filter((filme) => filme.nome.toLowerCase().includes(texto.toLowerCase()))

    setFilmesPesquisa(resultado)
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Pesquisar" placeholderTextColor={"#aaa"}
        value={termo} onChangeText={pesquisa} />
      
      <FlatList data={filmesPesquisa} keyExtractor={(item) => String(item.id)} contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => router.push(`/(main)/tabs/filme/${item.id}`)} >
            <Image source={{ uri: item.imagem }} style={styles.cover} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.nota}>★ {item.nota.toFixed(1)}</Text>
            </View>
        </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "#494949",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#3b3b3b",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 14,
  },
  nome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  nota: {
    color: "#e9de14",
    marginBottom: 6,
  }
})