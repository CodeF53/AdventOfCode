ids = File.read('./src/2025/02.input').strip.split(',').flat_map do |range_str|
  Range.new(*range_str.split('-').map(&:to_i)).to_a
end
pp ids.filter { |id| /^(\d+)\1$/.match?(id.to_s) }.sum
pp ids.filter { |id| /^(\d+)\1+$/.match?(id.to_s) }.sum
