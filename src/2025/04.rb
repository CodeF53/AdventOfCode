grid = File.readlines('./src/2025/04.input').map { |l| l.chars.map { |c| c == '@' } }

def position_inbounds?(y, x, grid)
  !y.negative? && !x.negative? && y < grid.length && x < grid[0].length
end

def position_accessible?(y, x, grid)
  occupied_adjacent = 0
  (-1..1).each do |y_offset|
    y_o = y + y_offset
    (-1..1).each do |x_offset|
      x_o = x + x_offset
      next unless position_inbounds?(y_o, x_o, grid)
      next if y_offset.zero? && x_offset.zero?

      occupied_adjacent += 1 if grid[y_o][x_o] == true
    end
  end
  occupied_adjacent < 4
end

def accessible_positions(grid)
  accessable_positions = []
  grid.each_index do |y|
    grid[y].each_index do |x|
      next if grid[y][x] == false

      accessable_positions.push([y, x]) if position_accessible?(y, x, grid)
    end
  end
  accessable_positions
end

positions = accessible_positions(grid)
total_accessible = positions.length
puts "Part 1: #{total_accessible}"
while positions.length.positive?
  positions.each do |position|
    grid[position[0]][position[1]] = false
  end
  positions = accessible_positions(grid)
  total_accessible += positions.length
end
puts "Part 2: #{total_accessible}"
