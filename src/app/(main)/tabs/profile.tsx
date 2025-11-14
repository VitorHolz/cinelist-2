import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';

interface Filme {
  id: number,
  nome: string,
  imagem: string,
  descricao: string,
  nota?: number
}

export default function ProfileScreen() {
  const [watchlist, setWatchlist] = useState<Filme[]>([])
  const [assistido, setAssistido] = useState<Filme[]>([])

  useEffect(() => {
    async function carregarListas() {
      const dataW = await AsyncStorage.getItem("watchlist")
      const dataA = await AsyncStorage.getItem("assistido")
      const wlist = dataW ? JSON.parse(dataW) : []
      const visto = dataA ? JSON.parse(dataA) : []
      setWatchlist(wlist)
      setAssistido(visto)
    }
    const unsubscribe = setInterval(carregarListas, 1000)
    return() => clearInterval(unsubscribe)
  }, [])

  async function remover(id: number, tipo: "watchlist" | "assistido") {
    Alert.alert(
      "remover filme",
      "tem certeza que deseja remover esse filme?",
      [
        { text: "cancelar", style: "cancel" },
        {
          text: "remover",
          style: "destructive",
          onPress: async () => {
            const data = await AsyncStorage.getItem(tipo)
            const lista: Filme[] = data ? JSON.parse(data) : []
            const novaLista = lista.filter((f) => f.id !== id)
            await AsyncStorage.setItem(tipo, JSON.stringify(novaLista))
            if (tipo === "watchlist") setWatchlist(novaLista)
            else setAssistido(novaLista)
          }
        }
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.section}>Watchlist</Text>
      <Text style={styles.contador}>{watchlist.length} filmes</Text>
      {watchlist.length === 0 && <Text style={styles.empty}>Nenhum filme adicionado</Text>}
      <ScrollView horizontal>
        {watchlist.map((f) => (
          <View key={f.id} style={styles.filmeBox}>
            <Image source={{ uri: f.imagem }} style={styles.image} />
            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => remover(f.id, "watchlist")} >
              <Text style={styles.bRemoverTexto}>Remover</Text>
              </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.section}>Assistidos</Text>
      <Text style={styles.contador}>{assistido.length} filmes</Text>
      {assistido.length === 0 && <Text style={styles.empty}>Nenhum filme adicionado</Text>}
      <ScrollView horizontal>
        {assistido.map((f) => (
          <View key={f.id} style={styles.filmeBox}>
            <Image source={{ uri: f.imagem }} style={styles.image} />
            <Text style={styles.nota}>★{f.nota}</Text>
            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => remover(f.id, "assistido")} >
              <Text style={styles.bRemoverTexto}>Remover</Text>
              </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#303030ff',
    flex: 1,
    padding: 16
  },
  title: {
    color: '#e9de14ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  section: {
    color: "#e9de14",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10
  },
  empty: {
    color: "#aaa",
    marginBottom: 10
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 10
  },
  filmeBox: {
    alignItems: "center",
    marginRight: 12
  },
  nota: {
    color: "#e9de14",
    marginTop: 4
  },
  botaoRemover: {
    backgroundColor: "#a19911ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 5
  },
  bRemoverTexto: {
    color: "#303030",
    fontSize: 12
  },
  contador: {
    color: "#e9de14",
    fontSize: 16,
    marginBottom: 4,
}
});