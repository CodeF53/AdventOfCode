instructions = File.read('./src/2025/01.input').strip.split("\n")
dial_pos = 50
zero_count_p1 = 0
zero_count_p2 = 0
instructions.each do |instruction|
  distance = instruction[1..].to_i
  direction = instruction[0] == 'L' ? -1 : 1
  while distance.positive?
    distance -= 1
    dial_pos += direction
    dial_pos %= 100
    zero_count_p2 += 1 if dial_pos.zero?
  end
  zero_count_p1 += 1 if dial_pos.zero?
end
puts zero_count_p1
puts zero_count_p2
