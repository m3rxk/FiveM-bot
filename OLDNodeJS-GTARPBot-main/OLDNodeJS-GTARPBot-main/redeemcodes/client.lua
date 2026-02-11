AddEventHandler('onClientResourceStart', function (resourceName)
    if (GetCurrentResourceName() == resourceName) then
        TriggerEvent('chat:addSuggestion', '/multigen', 'Generate multiple codes at once', {
            { name="type", help="What code you want to generate. For example: money" },
            { name="amount", help="How much (in this example money) will the player be rewarded. For example: 25" },
            { name="count", help="How many keys you want to generate. For Example: 20" }
        })
        TriggerEvent('chat:addSuggestion', '/gencode', 'Generate a reward', {
            { name="type", help="What code you want to generate. For example: Cars" },
            { name="amount", help="How much (in this example money) will the player be rewarded. For example: 1000" }
        })
        TriggerEvent('chat:addSuggestion', '/redeem', 'Redeem a  code', {
            { name="code", help="Enter the code you want to redeem." }
        })
    end
end)

AddEventHandler('onClientResourceStop', function(resourceName)
    if (GetCurrentResourceName() == resourceName) then
        TriggerEvent('chat:removeSuggestion', '/gencode')
        TriggerEvent('chat:removeSuggestion', '/multigen')
        TriggerEvent('chat:removeSuggestion', '/redeem')
    end
end)