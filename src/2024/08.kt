// kotlinc src/2024/08.kt -include-runtime -d o.jar && ./o.jar && rm ./o.jar
import java.io.File

interface Pos {
    val x: Int
    val y: Int
}

fun main(args : Array<String>) {
    val input: String = File("src/2024/08.input").readText()
    val grid = input.split("\n").map { it.toCharArray() }
}
