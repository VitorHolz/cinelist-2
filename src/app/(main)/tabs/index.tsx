import { StatusBar, Text, View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import FilmeCover from '../../../components/capa';

interface Filme {
  id: number;
  nome: string;
  imagem: string;
  nota: number;
}

export default function ExploreScreen() {
  const [filmesAlta, setFilmesAlta] = useState<Filme[]>([])
  const [filmesRecomendados, setFilmesRecomendados] = useState<Filme[]>([])

  useEffect(() => {
    async function carregarFilmes() {
      try {
        const baseURL = "http://localhost:3000"
        const [resAlta, resRecomendados] = await Promise.all([
          fetch(`${baseURL}/filmesAlta`),
          fetch(`${baseURL}/filmesRecomendados`)
        ])

        const [dataAlta, dataRecomendados] = await Promise.all([
          resAlta.json(),
          resRecomendados.json()
        ])
        setFilmesAlta(dataAlta);
        setFilmesRecomendados(dataRecomendados);
      } catch (error) {
        console.error(error);
      }
    }
    carregarFilmes();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: '#303030ff' }}>
      <StatusBar backgroundColor={'#FFFFFF'}/>
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.text}>Em alta</Text>
          <FlatList
            data={filmesAlta}
            horizontal
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => {
              return <FilmeCover filme={item} />
            }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            showsHorizontalScrollIndicator={false} />
          <Text style={styles.text}>Recomendado</Text>
          <FlatList
            data={filmesRecomendados}
            horizontal
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => {
              return <FilmeCover filme={item} />
            }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            showsHorizontalScrollIndicator={false} />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 40, marginTop: -40, marginBottom: 40 },
  text: { color: '#e9de14ff', padding: 20, fontSize: 24 }
});