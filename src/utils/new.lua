local options = {"Option 1", "Option 2", "Option 3", "Quit"}
local selected = 1

function showMenu()
    os.execute("clear")
    print("Use w/s to move, Enter to select:")
    for i, opt in ipairs(options) do
        if i == selected then
            io.write("\27[32m> " .. opt .. "\27[0m\n")
        else
            io.write("  " .. opt .. "\n")
        end
    end
end

while true do
    showMenu()
    local key = io.read()
    if key == "w" then
        selected = selected - 1
        if selected < 1 then selected = #options end
    elseif key == "s" then
        selected = selected + 1
        if selected > #options then selected = 1 end
    elseif key == "" then -- Enter
        print("You selected: " .. options[selected])
        if options[selected] == "Quit" then break end
        print("Press Enter to continue...")
        io.read()
    end
end
