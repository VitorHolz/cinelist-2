import { Image } from "expo-image"
import { StyleSheet, Touchable, TouchableOpacity, View } from "react-native"
import { Alta } from "../Filmes/filme"
import { useRouter } from "expo-router"

interface Props {
  filme: {
    id: number
    nome: string
    imagem: string
    nota: number
  }
}

export default function FilmeCover({ filme }: Props) {
  const router = useRouter()

  return (
    <TouchableOpacity
      style={styles.botao}
      onPress={() => router.push(`/(main)/tabs/filme/${filme.id}`)}>
    <View style={styles.container}>
      <Image style={styles.image} source={filme.imagem} />
    </View>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9de14ff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 4,
    borderRadius: 16
  },
  image: {
    width: 250,
    height: 350,
    borderRadius: 8
  },
  botao: {
    width: "auto",
    marginBottom: 10
  }
})