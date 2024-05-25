import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

class Mod implements IPostDBLoadMod {

    private modConfig = require("../config/config.json");

    public postDBLoad(container: DependencyContainer): void {
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
        const tables = databaseServer.getTables()
        const logger = container.resolve<ILogger>("WinstonLogger");

        logger.logWithColor("NoStreetsQuests loading...", LogTextColor.GREEN);        
        
        const zone_and_places = [
            'quest_produkt1',
            'quest_produkt2',
            'quest_produkt3',
            'quest_produkt4',
            'quest_zone_c11_gmed',
            'quest_zone_c16_koll_1',
            'quest_zone_c16_koll_2',
            'quest_zone_c21_look',
            'quest_zone_c25_cinem',
            'quest_zone_c25_cinem2',
            'quest_zone_c27_sect',
            'quest_zone_c29_debt',
            'quest_zone_c5_mar',
            'quest_zone_c6_kpss',
            'quest_zone_c7_mel',
            'quest_zone_c8_dom1',
            'quest_zone_c8_dom2',
            'quest_zone_c8_dom2_dead',
            'quest_zone_find_2st_kpss2',
            'quest_zone_find_2st_mech',
            'quest_zone_hide_2st_mech',
            'quest_zone_find_2st_med_invent1',
            'quest_zone_find_2st_med_invent2',
            'quest_zone_find_sillent',
            'quest_zone_hide_sillent',
            'quest_zone_hide_sillent2',
            'quest_zone_keeper00',
            'quest_zone_keeper99',
            'quest_zone_keeper10_kill',
            'quest_zone_keeper10_place',
            'quest_zone_keeper8_1',
            'quest_zone_keeper8_1_hide1',
            'quest_zone_keeper8_2',
            'quest_zone_keeper8_1_hide2',
            'quest_zone_keeper8_3',
            'quest_zone_keeper8_1_hide3',
            'quest_zone_kill_c17_adm',
            'quest_zone_prod_flare',
            'quest_zone_kill_cinema',
            'quest_zone_kill_kardinal',
            'quest_zone_kill_shool',
            'quest_zone_kill_stilo',
            'quest_zone_last_flare',
            'quest_zone_place_c14_revx_1',
            'quest_zone_place_c14_revx_2',
            'quest_zone_place_c14_revx_3',
            'quest_zone_place_c22_harley_3',
            'quest_zone_place_c24_tigr1'
        ]

        const quests = tables.templates.quests;
 
        for (const quest in quests) {
            if (quests[quest].location == '5714dc692459777137212e12') {
                for (const subquest in quests[quest].conditions.AvailableForFinish) {
                    quests[quest].conditions.AvailableForFinish[subquest] = 
                        {
                            "conditionType": "HandoverItem",
                            "dogtagLevel": 0,
                            "dynamicLocale": false,
                            "globalQuestCounterId": "",
                            "id": quests[quest].conditions.AvailableForFinish[subquest].id,
                            "index": 0,
                            "isEncoded": false,
                            "maxDurability": 100,
                            "minDurability": 0,
                            "onlyFoundInRaid": false,
                            "parentId": "",
                            "target": [
                                "5449016a4bdc2d6f028b456f"
                            ],
                            "value": this.modConfig.handOverAmount || 50000,
                            "visibilityConditions": []
                        }
                }

            } else if (quests[quest].location == 'any' ) {
                const conditionsAFF = quests[quest].conditions.AvailableForFinish;

                if (conditionsAFF !== undefined) {
                    var conditionsToModify = []
                    for (const condition in conditionsAFF) {
                        if (conditionsAFF[condition]?.conditionType == 'CounterCreator') {
                            for (const c in conditionsAFF[condition].counter.conditions) {
                                if (conditionsAFF[condition].counter.conditions[c].conditionType == 'Location' && conditionsAFF[condition].counter.conditions[c].target[0] == 'TarkovStreets') {
                                    conditionsToModify.push(conditionsAFF[condition].id)
                                } else if (conditionsAFF[condition].counter.conditions[c].conditionType == 'VisitPlace' && zone_and_places.includes(conditionsAFF[condition].counter.conditions[c].target)) {
                                    conditionsToModify.push(conditionsAFF[condition].id)
                                } 
                            }
                        } else if (conditionsAFF[condition]?.conditionType == 'LeaveItemAtLocation' && zone_and_places.includes(conditionsAFF[condition].zoneId)) {
                            conditionsToModify.push(conditionsAFF[condition].id)
                        }
                    }

                    if (conditionsToModify.length > 0 ) {
                        conditionsToModify.forEach(id => {
                            for (const condition in conditionsAFF) { 
                                if (conditionsAFF[condition].id == id) {
                                    conditionsAFF[condition] = {
                                        "conditionType": "HandoverItem",
                                        "dogtagLevel": 0,
                                        "dynamicLocale": false,
                                        "globalQuestCounterId": "",
                                        "id": id,
                                        "index": 0,
                                        "isEncoded": false,
                                        "maxDurability": 100,
                                        "minDurability": 0,
                                        "onlyFoundInRaid": false,
                                        "parentId": "",
                                        "target": [
                                            "5449016a4bdc2d6f028b456f"
                                        ],
                                        "value": this.modConfig.handOverAmount || 50000,
                                        "visibilityConditions": []
                                    }
                                }
                            }
                        })
                    }
                }
            }
            
        }
        logger.logWithColor("NoStreetsQuests done.", LogTextColor.GREEN);        
    }
}

module.exports = { mod: new Mod() }