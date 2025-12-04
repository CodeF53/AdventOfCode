battery_banks = File.readlines('./src/2025/03.input').map { |bank| bank.strip.chars.map(&:to_i) }
def get_bank_joltage_p1(bank)
  max_joltage = 0
  bank[0..-2].each_with_index do |joltage, i|
    joltage = (joltage * 10) + bank[i + 1, bank.length].max
    max_joltage = joltage if joltage > max_joltage
  end
  max_joltage
end
puts(battery_banks.sum { |b| get_bank_joltage_p1(b) })
