import java.io.File
import kotlin.math.abs

fun main(args : Array<String>) {
    val fileContent = File("src/2024/01.input").readText()
    val lines = fileContent.split("\n")
    val parsedLines = lines.map { it.split("\\s+".toRegex()).map { it.toInt() } }
    val one = parsedLines.map { it[0] }.sorted()
    val two = parsedLines.map { it[1] }.sorted()

    var sumPartOne = 0
    for (i in one.indices)
        sumPartOne += abs(one[i] - two[i])
    println(sumPartOne)

    val maxes = mutableMapOf<Int,Int>()
    for (num in two) {
        val cur: Int = maxes.get(num) ?: 0
        maxes.put(num, cur + 1)
    }
    var sumPartTwo = 0
    for (num in one)
        sumPartTwo += num * (maxes[num] ?: 0)

    println(sumPartTwo)
}
