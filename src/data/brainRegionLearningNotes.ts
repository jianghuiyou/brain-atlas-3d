import type { BrainRegionId, BrainRegionLearningNote, SourceLink } from '../types/brain'

const stressResponse: SourceLink = {
  label: 'NCBI Bookshelf: Physiology, Stress Reaction',
  url: 'https://www.ncbi.nlm.nih.gov/books/NBK541120/',
}

const stressCircuitReview: SourceLink = {
  label: 'Nature Reviews Neuroscience: Neural Regulation of Endocrine and Autonomic Stress Responses',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4240627/',
}

const monoamineSystems: SourceLink = {
  label: 'Brain Structure and Function: Mapping Major Neurotransmitter Systems',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12364969/',
}

const dopaminePredictionError: SourceLink = {
  label: 'Annual Review of Neuroscience: Neural Circuitry of Reward Prediction Error',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6721851/',
}

const reinforcementLearning: SourceLink = {
  label: 'Frontiers in Psychiatry: Computational Reinforcement Learning and Dopamine',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9630918/',
}

const cerebralHemisphere: SourceLink = {
  label: 'NCBI Bookshelf: Neuroanatomy, Cerebral Hemisphere',
  url: 'https://www.ncbi.nlm.nih.gov/books/NBK549789/',
}

const anatomyCns: SourceLink = {
  label: 'NCBI Bookshelf: Anatomy, Central Nervous System',
  url: 'https://www.ncbi.nlm.nih.gov/books/NBK542179/',
}

const nindsBrainBasics: SourceLink = {
  label: 'NINDS Brain Basics: Know Your Brain',
  url: 'https://www.ninds.nih.gov/health-information/patient-caregiver-education/brain-basics-know-your-brain',
}

export const brainRegionLearningNotes: Record<BrainRegionId, BrainRegionLearningNote> = {
  'whole-brain': {
    emotionNeurochemistry:
      '情绪不是由单一脑区或单一化学物质决定的。紧张时，交感神经-肾上腺髓质系统会快速提高肾上腺素/去甲肾上腺素相关反应；随后 HPA 轴可能通过下丘脑-垂体-肾上腺通路提高皮质醇。多巴胺、血清素和去甲肾上腺素等单胺系统从脑干和中脑核团广泛投射，像“全局调制旋钮”一样改变警觉、动机、心境、注意和学习状态。',
    furtherReading: [stressResponse, stressCircuitReview, monoamineSystems, dopaminePredictionError],
  },
  'left-hemisphere': {
    emotionNeurochemistry:
      '左半球本身不是某种激素的来源。情绪相关化学信号通常来自脑干、中脑、下丘脑和外周内分泌系统，再影响两侧半球的皮层处理。左半球语言相关网络有助于把情绪命名和叙述出来，这可能间接帮助前额叶参与调节。',
    furtherReading: [cerebralHemisphere, anatomyCns, monoamineSystems],
  },
  'right-hemisphere': {
    emotionNeurochemistry:
      '右半球不是“情绪脑”，但它常参与语调、面孔、空间和整体情境线索处理。这些输入会影响杏仁核、前额叶和自主神经系统对安全/威胁的评估。肾上腺素、皮质醇、去甲肾上腺素等状态信号会同时改变右半球和左半球的信息处理方式。',
    furtherReading: [cerebralHemisphere, anatomyCns, monoamineSystems],
  },
  'frontal-lobe': {
    emotionNeurochemistry:
      '额叶尤其是前额叶网络参与“先停一下再行动”的调节。压力升高时，去甲肾上腺素和皮质醇会改变注意、工作记忆和控制能力；适度唤醒可能提升表现，过强或长期压力则可能让控制更依赖自动反应。额叶并不分泌这些激素，而是受这些状态信号调制。',
    furtherReading: [cerebralHemisphere, stressResponse, monoamineSystems],
  },
  'prefrontal-cortex': {
    emotionNeurochemistry:
      '前额叶和杏仁核、海马体、下丘脑存在双向影响。面对压力时，前额叶可以帮助重新评估情境、抑制冲动和选择长期目标；但高皮质醇、高去甲肾上腺素状态可能削弱工作记忆和灵活控制。血清素、多巴胺等系统也会影响前额叶的稳定性和灵活性。',
    furtherReading: [stressCircuitReview, monoamineSystems, reinforcementLearning],
  },
  'dorsolateral-prefrontal-cortex': {
    emotionNeurochemistry:
      '背外侧前额叶常与工作记忆和认知控制相关。压力和睡眠不足会通过去甲肾上腺素、皮质醇等状态信号影响它维持目标和抗干扰的能力。情绪强烈时，它可能需要更多资源来把注意从威胁线索拉回任务。',
    furtherReading: [cerebralHemisphere, stressResponse, monoamineSystems],
  },
  'ventromedial-prefrontal-cortex': {
    emotionNeurochemistry:
      '腹内侧前额叶常参与价值评估和情境化决策。它会整合身体状态、记忆和奖惩线索；多巴胺相关奖励信号、皮质醇相关压力状态和杏仁核显著性信号都可能改变它对某个选择“值不值得”的估计。',
    furtherReading: [dopaminePredictionError, reinforcementLearning, stressCircuitReview],
  },
  'medial-prefrontal-cortex': {
    emotionNeurochemistry:
      '内侧前额叶参与自我相关和社会情境评估。情绪中常见的“我是不是安全”“别人怎么看我”等判断，可能牵涉该区域与杏仁核、海马体和默认网络的交互。单胺系统会改变其整体兴奋性和信息整合方式。',
    furtherReading: [monoamineSystems, stressCircuitReview, anatomyCns],
  },
  'motor-cortex': {
    emotionNeurochemistry:
      '情绪会改变运动准备：紧张时肾上腺素和去甲肾上腺素提高心率、肌肉张力和警觉性，运动皮层更容易进入准备行动状态。多巴胺也会影响运动启动和动作选择，但具体通路常涉及基底节。',
    furtherReading: [nindsBrainBasics, anatomyCns, monoamineSystems],
  },
  'dorsal-anterior-cingulate-cortex': {
    emotionNeurochemistry:
      '背侧前扣带皮层常在冲突、错误、努力和疼痛相关任务中被讨论。压力或威胁会提高去甲肾上腺素相关警觉，让系统更关注错误和冲突；这有助于快速调整，但过度时可能表现为反复监控和难以放松。',
    furtherReading: [stressResponse, monoamineSystems, reinforcementLearning],
  },
  'parietal-lobe': {
    emotionNeurochemistry:
      '顶叶整合身体位置、触觉和空间注意。紧张时，身体信号可能被放大，例如心跳、肌肉紧绷或胃部感觉；这与自主神经和去甲肾上腺素状态有关。顶叶帮助把这些感觉定位到身体和空间坐标中。',
    furtherReading: [cerebralHemisphere, nindsBrainBasics, monoamineSystems],
  },
  'somatosensory-cortex': {
    emotionNeurochemistry:
      '躯体感觉皮层接收身体触觉、温度、疼痛和位置相关信息。压力状态下，去甲肾上腺素和自主神经变化会让某些身体感觉更突出；慢性压力也可能让疼痛或不适感更容易被注意到。',
    furtherReading: [nindsBrainBasics, cerebralHemisphere, stressResponse],
  },
  'angular-gyrus': {
    emotionNeurochemistry:
      '角回不直接对应某个激素系统，但它整合语言、语义、数字和多感觉信息。情绪词、社会评价和自我叙事会通过语言语义系统影响身体和情绪网络；单胺系统会调制注意和语义处理的状态。',
    furtherReading: [cerebralHemisphere, monoamineSystems, anatomyCns],
  },
  'temporoparietal-junction': {
    emotionNeurochemistry:
      '颞顶联合区常与注意重定向和社会视角相关。当环境中出现突发线索或他人反馈时，去甲肾上腺素相关警觉系统会帮助注意转移；这些社会线索也可能进一步影响杏仁核和前额叶评估。',
    furtherReading: [monoamineSystems, stressCircuitReview, anatomyCns],
  },
  'temporal-lobe': {
    emotionNeurochemistry:
      '颞叶处理声音、语言、语义和记忆相关信息。语气、面孔、熟悉场景和过往经验会影响杏仁核与海马体的反应，从而改变压力和情绪评估。情绪并不是颞叶单独产生，而是颞叶输入参与全脑解释。',
    furtherReading: [cerebralHemisphere, nindsBrainBasics, monoamineSystems],
  },
  'temporal-cortex': {
    emotionNeurochemistry:
      '颞叶皮层对声音、语言和物体线索敏感。日常情绪常由一句话、一个语气或一个熟悉场景触发，这些线索会经过颞叶表征，再与杏仁核、海马体和前额叶网络交互。',
    furtherReading: [cerebralHemisphere, nindsBrainBasics, anatomyCns],
  },
  'occipital-lobe': {
    emotionNeurochemistry:
      '枕叶主要处理视觉输入。视觉威胁、表情、光线和运动线索会先改变视觉表征，再传向颞叶、顶叶、杏仁核和前额叶。去甲肾上腺素升高时，视觉注意可能更偏向显著或威胁线索。',
    furtherReading: [nindsBrainBasics, cerebralHemisphere, monoamineSystems],
  },
  'visual-cortex': {
    emotionNeurochemistry:
      '视觉皮层本身不“产生情绪”，但它决定了威胁、表情、颜色和动作等视觉信息如何被编码。压力状态下，注意系统会改变视觉皮层的增益，让某些线索更突出。',
    furtherReading: [nindsBrainBasics, cerebralHemisphere, anatomyCns],
  },
  'ventral-visual-stream': {
    emotionNeurochemistry:
      '腹侧视觉通路帮助识别“这是什么”。当识别出人脸、危险物体或熟悉场景时，信息会影响杏仁核、海马体和前额叶；多巴胺和去甲肾上腺素状态会改变我们对重要物体的敏感性。',
    furtherReading: [nindsBrainBasics, monoamineSystems, anatomyCns],
  },
  amygdala: {
    emotionNeurochemistry:
      '杏仁核参与显著性和威胁/奖惩线索学习。它可影响下丘脑和脑干相关通路，推动交感神经和 HPA 轴反应：快速阶段可能表现为肾上腺素/去甲肾上腺素相关唤醒，较慢阶段可能涉及皮质醇。它不是“恐惧制造器”，而是给线索打上优先级标签的网络节点。',
    furtherReading: [stressCircuitReview, stressResponse, monoamineSystems],
  },
  hippocampus: {
    emotionNeurochemistry:
      '海马体把事件、地点和上下文组织成记忆索引。压力激素皮质醇会影响记忆编码和检索：短期适度唤醒可能增强某些记忆，长期或过强压力则可能损害灵活记忆。海马体也参与对 HPA 轴的反馈调节。',
    furtherReading: [stressCircuitReview, stressResponse, reinforcementLearning],
  },
  hypothalamus: {
    emotionNeurochemistry:
      '下丘脑是连接情绪和身体状态的关键接口。压力时，下丘脑可释放 CRH，推动垂体释放 ACTH，进而促使肾上腺皮质释放皮质醇；它也参与体温、饥饿、口渴、睡眠和自主神经调节。肾上腺素更多来自肾上腺髓质和交感系统，和下丘脑-脑干调节密切相关。',
    furtherReading: [stressResponse, stressCircuitReview, anatomyCns],
  },
  thalamus: {
    emotionNeurochemistry:
      '丘脑参与感觉中继、注意和觉醒状态调节。情绪状态会改变哪些信息更容易被放大或进入皮层处理；去甲肾上腺素、血清素、多巴胺等系统会调制丘脑-皮层环路的节律和门控。',
    furtherReading: [anatomyCns, monoamineSystems, stressCircuitReview],
  },
  'corpus-callosum': {
    emotionNeurochemistry:
      '胼胝体是白质连接束，本身不是神经递质或激素的主要来源。但情绪调节常需要两侧半球协作：语言化、空间线索、身体感觉和记忆需要跨半球整合。全局神经化学状态会影响两侧网络通信效率。',
    furtherReading: [cerebralHemisphere, anatomyCns, monoamineSystems],
  },
  cerebellum: {
    emotionNeurochemistry:
      '小脑传统上与运动协调有关，也参与时序、预测和误差校正。情绪状态会通过身体动作、呼吸节律和自主神经状态间接影响小脑相关回路；多巴胺、去甲肾上腺素等调制系统也会影响运动学习和警觉状态。',
    furtherReading: [nindsBrainBasics, anatomyCns, reinforcementLearning],
  },
  brainstem: {
    emotionNeurochemistry:
      '脑干包含许多维持生命和调节状态的通路，也包含重要单胺核团来源附近区域，例如去甲肾上腺素相关的蓝斑、血清素相关的中缝核和多巴胺相关中脑系统。它们广泛投射到全脑，改变警觉、睡眠、注意、心境和运动准备。',
    furtherReading: [monoamineSystems, stressResponse, anatomyCns],
  },
}
