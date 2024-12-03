import java.io.File
import kotlin.math.abs

fun main(args : Array<String>) {
    val input = File("src/2024/03.input").readText()
    val operations = "mul\\(\\d+,\\d+\\)|(?:don't|do)\\(\\)".toRegex().findAll(input)
        .toList().map { it.value }

    var total = 0
    var doStuff = true
    for (operation in operations) {
      if (operation == "don't()") doStuff = false
      if (operation == "do()") doStuff = true
      if (!doStuff || !operation.startsWith("mul"))
        continue
      val (_match, a, b) = "mul\\((\\d+),(\\d+)\\)".toRegex().find(operation)!!.groupValues
      total += a.toInt() * b.toInt()
    }
  
    println(total)
}
